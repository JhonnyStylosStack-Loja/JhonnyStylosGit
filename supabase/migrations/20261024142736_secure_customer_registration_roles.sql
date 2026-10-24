-- Every public signup is a customer. Privileged roles are never accepted from
-- user_metadata and can only be changed from a trusted server/dashboard.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists email text;
alter table public.users add column if not exists full_name text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists role text;
alter table public.users add column if not exists created_at timestamptz default now();
alter table public.users add column if not exists updated_at timestamptz default now();

update public.users set role = 'customer' where role is null;
alter table public.users alter column role set default 'customer';
alter table public.users alter column role set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'users_role_allowed'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_role_allowed check (role in ('customer', 'admin', 'hr'));
  end if;
end
$$;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid())
      and role in ('admin', 'hr')
  );
$$;

revoke all on function private.is_staff() from public;
grant execute on function private.is_staff() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.users.full_name, excluded.full_name),
        updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_user();

-- Backfill existing Auth users without ever trusting their user_metadata for a role.
insert into public.users (id, email, full_name, role)
select
  id,
  email,
  nullif(trim(raw_user_meta_data ->> 'full_name'), ''),
  'customer'
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.users.full_name, excluded.full_name),
      updated_at = now();

alter table public.users enable row level security;
alter table public.users force row level security;

-- PostgreSQL combines permissive policies with OR. Remove legacy policies on
-- the protected commerce tables so an older broad rule cannot bypass these.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'users', 'addresses', 'cart_items', 'wishlists', 'orders', 'order_items',
        'categories', 'products', 'product_images', 'blog_posts',
        'collections', 'product_collections'
      ])
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end
$$;

drop policy if exists "users_select_own_or_staff" on public.users;
create policy "users_select_own_or_staff"
on public.users for select
to authenticated
using ((select auth.uid()) = id or (select private.is_staff()));

drop policy if exists "users_update_own_or_staff" on public.users;
create policy "users_update_own_or_staff"
on public.users for update
to authenticated
using ((select auth.uid()) = id or (select private.is_staff()))
with check ((select auth.uid()) = id or (select private.is_staff()));

-- RLS limits rows; column grants prevent a customer from changing role/email.
revoke all on table public.users from anon;
revoke insert, delete on table public.users from authenticated;
revoke update on table public.users from authenticated;
grant select on table public.users to authenticated;
grant update (full_name, phone, avatar_url, updated_at) on table public.users to authenticated;

comment on column public.users.role is
  'Authorization role. Never populate from user_metadata; only trusted server-side administrators may change it.';

-- Public catalog: everyone may read it, but only staff may mutate it.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'categories', 'products', 'product_images', 'blog_posts',
    'collections', 'product_collections'
  ] loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('alter table public.%I force row level security', table_name);
      execute format('revoke all on table public.%I from anon, authenticated', table_name);
      execute format('grant select on table public.%I to anon, authenticated', table_name);
      execute format('grant insert, update, delete on table public.%I to authenticated', table_name);
      execute format('drop policy if exists "catalog_public_read" on public.%I', table_name);
      execute format(
        'create policy "catalog_public_read" on public.%I for select to anon, authenticated using (true)',
        table_name
      );
      execute format('drop policy if exists "catalog_staff_manage" on public.%I', table_name);
      execute format(
        'create policy "catalog_staff_manage" on public.%I for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()))',
        table_name
      );
    end if;
  end loop;
end
$$;

-- Customer-owned data: a customer can only see and change rows carrying their id.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['addresses', 'carts', 'wishlists'] loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('alter table public.%I force row level security', table_name);
      execute format('revoke all on table public.%I from anon', table_name);
      execute format('revoke all on table public.%I from authenticated', table_name);
      execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
      execute format('drop policy if exists "customer_owns_row" on public.%I', table_name);
      execute format(
        'create policy "customer_owns_row" on public.%I for all to authenticated using ((select auth.uid()) = user_id or (select private.is_staff())) with check ((select auth.uid()) = user_id or (select private.is_staff()))',
        table_name
      );
    end if;
  end loop;
end
$$;

-- Cart items belong to a cart rather than directly to a user. Do not assume a
-- user_id column here: the production schema uses cart_id.
do $$
begin
  if to_regclass('public.cart_items') is not null then
    alter table public.cart_items enable row level security;
    alter table public.cart_items force row level security;
    revoke all on table public.cart_items from anon, authenticated;
    grant select, insert, update, delete on table public.cart_items to authenticated;
    drop policy if exists "customer_owns_row" on public.cart_items;
    drop policy if exists "cart_items_owner_or_staff" on public.cart_items;
    create policy "cart_items_owner_or_staff" on public.cart_items
      for all to authenticated
      using (
        (select private.is_staff()) or exists (
          select 1 from public.carts c
          where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
        )
      )
      with check (
        (select private.is_staff()) or exists (
          select 1 from public.carts c
          where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
        )
      );
  end if;
end
$$;

-- Orders are financial records. Customers may read their own history, but order
-- creation and status/total changes must come from the trusted payment backend.
do $$
begin
  if to_regclass('public.orders') is not null then
    alter table public.orders enable row level security;
    alter table public.orders force row level security;
    revoke all on table public.orders from anon, authenticated;
    grant select on table public.orders to authenticated;
    grant insert, update, delete on table public.orders to authenticated;

    drop policy if exists "orders_customer_read" on public.orders;
    create policy "orders_customer_read"
      on public.orders for select to authenticated
      using ((select auth.uid()) = user_id or (select private.is_staff()));

    drop policy if exists "orders_staff_manage" on public.orders;
    create policy "orders_staff_manage"
      on public.orders for all to authenticated
      using ((select private.is_staff()))
      with check ((select private.is_staff()));
  end if;

  if to_regclass('public.order_items') is not null then
    alter table public.order_items enable row level security;
    alter table public.order_items force row level security;
    revoke all on table public.order_items from anon, authenticated;
    grant select on table public.order_items to authenticated;
    grant insert, update, delete on table public.order_items to authenticated;

    drop policy if exists "order_items_customer_read" on public.order_items;
    create policy "order_items_customer_read"
      on public.order_items for select to authenticated
      using (
        (select private.is_staff())
        or exists (
          select 1 from public.orders
          where public.orders.id = order_items.order_id
            and public.orders.user_id = (select auth.uid())
        )
      );

    drop policy if exists "order_items_staff_manage" on public.order_items;
    create policy "order_items_staff_manage"
      on public.order_items for all to authenticated
      using ((select private.is_staff()))
      with check ((select private.is_staff()));
  end if;
end
$$;
