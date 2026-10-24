-- Product CMS additions are additive: existing catalog columns and rows stay intact.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  category text,
  brand text,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  image_url text,
  sku text,
  is_active boolean not null default false,
  status text,
  tags text[] not null default '{}',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists slug text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists category text;
alter table public.products add column if not exists category_id uuid
  references public.categories(id) on delete set null;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists original_price numeric(10,2);
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists is_active boolean not null default false;
alter table public.products add column if not exists status text;
alter table public.products add column if not exists tags text[] not null default '{}';
alter table public.products add column if not exists rating numeric(2,1) not null default 0;
alter table public.products add column if not exists review_count integer not null default 0;
alter table public.products add column if not exists created_at timestamptz not null default now();
alter table public.products add column if not exists updated_at timestamptz not null default now();

update public.products
set status = case when coalesce(is_active, false) then 'active' else 'draft' end
where status is null or status not in ('draft', 'active', 'archived');

update public.products
set slug = coalesce(nullif(slug, ''), nullif(sku, ''), 'produto-' || id::text)
where slug is null or slug = '';

update public.products p
set category_id = c.id
from public.categories c
where p.category_id is null and p.category = c.name;

alter table public.products alter column status set default 'draft';
alter table public.products alter column status set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_status_allowed'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_status_allowed
      check (status in ('draft', 'active', 'archived'));
  end if;
end
$$;

create unique index if not exists products_slug_unique_idx
  on public.products (slug) where slug is not null;
create unique index if not exists products_sku_case_insensitive_unique_idx
  on public.products (lower(sku)) where nullif(trim(sku), '') is not null;
create index if not exists products_status_created_idx
  on public.products (status, created_at desc);
create index if not exists products_category_id_idx on public.products (category_id);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_price_non_negative' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_price_non_negative check (price >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_original_price_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_original_price_valid check (original_price is null or original_price > price);
  end if;
end $$;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text,
  url text,
  alt text not null default '',
  position integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.product_images add column if not exists storage_path text;
alter table public.product_images add column if not exists url text;
alter table public.product_images add column if not exists alt text not null default '';
alter table public.product_images add column if not exists position integer not null default 0;
alter table public.product_images add column if not exists is_primary boolean not null default false;
create index if not exists product_images_product_position_idx
  on public.product_images (product_id, position);
create unique index if not exists product_images_product_position_unique_idx
  on public.product_images (product_id, position);
create unique index if not exists product_images_one_primary_unique_idx
  on public.product_images (product_id) where is_primary;

create or replace function private.require_product_image_before_publish()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.is_active := new.status = 'active';
  if new.status = 'active'
     and (tg_op = 'INSERT' or old.status is distinct from 'active')
     and not exists (
       select 1 from public.product_images
       where product_id = new.id and storage_path is not null
     ) then
    raise exception 'Adicione pelo menos uma imagem no Storage antes de publicar o produto.';
  end if;
  return new;
end;
$$;

drop trigger if exists product_image_required_for_publish on public.products;
create trigger product_image_required_for_publish
  before insert or update of status on public.products
  for each row execute function private.require_product_image_before_publish();

create or replace function private.require_product_image_for_active_product()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  checked_product_id uuid;
begin
  checked_product_id := case when tg_op = 'DELETE' then old.product_id else new.product_id end;
  if exists (select 1 from public.products where id = checked_product_id and status = 'active')
     and not exists (select 1 from public.product_images where product_id = checked_product_id and storage_path is not null) then
    raise exception 'Um produto publicado precisa manter pelo menos uma imagem.';
  end if;
  return null;
end;
$$;

drop trigger if exists product_image_required_while_active on public.product_images;
create constraint trigger product_image_required_while_active
  after delete or update of storage_path on public.product_images
  deferrable initially deferred
  for each row execute function private.require_product_image_for_active_product();

-- Keep Storage and catalog metadata in sync even when a product is deleted
-- outside the browser client. This function is trigger-only and not executable
-- by API roles.
create or replace function private.delete_product_image_object()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.storage_path is not null then
    delete from storage.objects
    where bucket_id = 'product-images' and name = old.storage_path;
  end if;
  return old;
end;
$$;
revoke all on function private.delete_product_image_object() from public, anon, authenticated;
drop trigger if exists delete_product_image_object on public.product_images;
create trigger delete_product_image_object
  after delete on public.product_images
  for each row execute function private.delete_product_image_object();

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null,
  color text not null default '',
  size text not null default '',
  price numeric(10,2),
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_variants_product_idx on public.product_variants (product_id);
create unique index if not exists product_variants_sku_unique_idx
  on public.product_variants (lower(sku));
create unique index if not exists product_variants_product_color_size_unique_idx
  on public.product_variants (product_id, lower(color), lower(size));
create index if not exists product_variants_color_size_idx
  on public.product_variants (color, size);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'product_variants_price_non_negative' and conrelid = 'public.product_variants'::regclass) then
    alter table public.product_variants add constraint product_variants_price_non_negative check (price is null or price >= 0);
  end if;
end $$;

alter table public.categories add column if not exists slug text;
alter table public.categories add column if not exists parent_id uuid
  references public.categories(id) on delete set null;

update public.categories
set slug = trim(both '-' from regexp_replace(
  lower(coalesce(name, '')), '[^a-z0-9]+', '-', 'g'
)) || '-' || left(id::text, 8)
where slug is null or slug = '';

create unique index if not exists categories_slug_unique_idx
  on public.categories (slug) where slug is not null;
create index if not exists categories_parent_id_idx on public.categories (parent_id);

-- Keep the current admin/RH authorization source: public.users.role via private.is_staff().
alter table public.products enable row level security;
alter table public.products force row level security;
alter table public.product_images enable row level security;
alter table public.product_images force row level security;
alter table public.product_variants enable row level security;
alter table public.product_variants force row level security;
alter table public.categories enable row level security;
alter table public.categories force row level security;

revoke all on public.products, public.product_images, public.product_variants, public.categories
  from anon, authenticated;
grant select on public.products, public.product_images, public.product_variants, public.categories
  to anon, authenticated;
grant insert, update, delete on public.products, public.product_images, public.product_variants, public.categories
  to authenticated;

drop policy if exists catalog_public_read on public.products;
create policy catalog_public_read on public.products
  for select to anon, authenticated using (status = 'active' or (select private.is_staff()));
drop policy if exists catalog_staff_manage on public.products;
create policy catalog_staff_insert on public.products for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.products for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.products for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_public_read on public.product_images;
create policy catalog_public_read on public.product_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.status = 'active'
  ) or (select private.is_staff()));
drop policy if exists catalog_staff_manage on public.product_images;
create policy catalog_staff_insert on public.product_images for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.product_images for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.product_images for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_public_read on public.product_variants;
create policy catalog_public_read on public.product_variants
  for select to anon, authenticated
  using (is_active and exists (
    select 1 from public.products p
    where p.id = product_variants.product_id and p.status = 'active'
  ) or (select private.is_staff()));
drop policy if exists catalog_staff_manage on public.product_variants;
create policy catalog_staff_insert on public.product_variants for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.product_variants for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.product_variants for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_public_read on public.categories;
create policy catalog_public_read on public.categories
  for select to anon, authenticated using (true);
drop policy if exists catalog_staff_manage on public.categories;
create policy catalog_staff_insert on public.categories for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.categories for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.categories for delete to authenticated using ((select private.is_staff()));

create or replace function public.save_product_images(p_product_id uuid, p_images jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  removed_paths jsonb;
begin
  if not (select private.is_staff()) then
    raise exception 'Acesso negado: perfil ADMIN ou RH necessário.';
  end if;
  if p_images is null or jsonb_typeof(p_images) is distinct from 'array' or jsonb_array_length(p_images) > 12 then
    raise exception 'Envie uma lista válida com no máximo 12 imagens.';
  end if;
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception 'Produto não encontrado.';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_images) item
    where coalesce(item ->> 'storage_path', '') not like (p_product_id::text || '/%')
  ) then
    raise exception 'Caminho de imagem inválido para este produto.';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_images) item
    where not exists (
      select 1 from storage.objects o
      where o.bucket_id = 'product-images' and o.name = (item ->> 'storage_path')
    )
  ) then
    raise exception 'Uma ou mais imagens ainda não foram enviadas ao Storage.';
  end if;
  if (select count(*) from jsonb_array_elements(p_images) item
      where coalesce((item ->> 'is_primary')::boolean, false)) > 1 then
    raise exception 'Defina somente uma imagem principal.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_images) item
    group by item ->> 'storage_path' having count(*) > 1
  ) then
    raise exception 'A mesma imagem não pode aparecer mais de uma vez.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_images) item
    where coalesce((item ->> 'position')::integer, -1) < 0
  ) then
    raise exception 'A posição da imagem é inválida.';
  end if;

  select coalesce(jsonb_agg(storage_path), '[]'::jsonb)
  into removed_paths
  from public.product_images
  where product_id = p_product_id
    and storage_path is not null
    and storage_path not in (
      select (item ->> 'storage_path') from jsonb_array_elements(p_images) item
    );

  -- Clear the partial unique primary index before changing the selected image.
  update public.product_images set is_primary = false where product_id = p_product_id;
  delete from public.product_images
  where product_id = p_product_id
    and storage_path not in (
      select item ->> 'storage_path' from jsonb_array_elements(p_images) item
    );
  update public.product_images i
  set url = item ->> 'storage_path',
      alt = coalesce(item ->> 'alt', ''),
      position = (item ->> 'position')::integer,
      is_primary = coalesce((item ->> 'is_primary')::boolean, false)
  from jsonb_array_elements(p_images) item
  where i.product_id = p_product_id and i.storage_path = item ->> 'storage_path';
  insert into public.product_images (product_id, storage_path, url, alt, position, is_primary)
  select p_product_id,
         item ->> 'storage_path',
         item ->> 'storage_path',
         coalesce(item ->> 'alt', ''),
         (item ->> 'position')::integer,
         coalesce((item ->> 'is_primary')::boolean, false)
  from jsonb_array_elements(p_images) item
  where not exists (
    select 1 from public.product_images i
    where i.product_id = p_product_id and i.storage_path = item ->> 'storage_path'
  );

  update public.products
  set image_url = (
    select storage_path from public.product_images
    where product_id = p_product_id
    order by is_primary desc, position asc
    limit 1
  ),
  updated_at = now()
  where id = p_product_id;

  return removed_paths;
end;
$$;

revoke all on function public.save_product_images(uuid, jsonb) from public, anon;
grant execute on function public.save_product_images(uuid, jsonb) to authenticated;

create or replace function public.save_product_variants(p_product_id uuid, p_variants jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_staff()) then
    raise exception 'Acesso negado: perfil ADMIN ou RH necessário.';
  end if;
  if p_variants is null or jsonb_typeof(p_variants) is distinct from 'array' or jsonb_array_length(p_variants) > 200 then
    raise exception 'Lista de variantes inválida.';
  end if;
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception 'Produto não encontrado.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_variants) item
    where coalesce(trim(item ->> 'sku'), '') = ''
       or coalesce((item ->> 'stock')::integer, -1) < 0
  ) then
    raise exception 'Cada variante precisa de SKU e estoque igual ou maior que zero.';
  end if;

  delete from public.product_variants where product_id = p_product_id;
  insert into public.product_variants (product_id, sku, color, size, price, stock, is_active)
  select p_product_id,
         trim(item ->> 'sku'),
         coalesce(trim(item ->> 'color'), ''),
         coalesce(trim(item ->> 'size'), ''),
         nullif(item ->> 'price', '')::numeric,
         (item ->> 'stock')::integer,
         coalesce((item ->> 'is_active')::boolean, true)
  from jsonb_array_elements(p_variants) item;
end;
$$;

revoke all on function public.save_product_variants(uuid, jsonb) from public, anon;
grant execute on function public.save_product_variants(uuid, jsonb) to authenticated;

create or replace function public.search_admin_products(
  p_search text default null,
  p_category text default null,
  p_status text default null
)
returns setof public.products
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_staff()) then
    raise exception 'Acesso negado: perfil ADMIN ou RH necessário.';
  end if;

  return query
  select p.*
  from public.products p
  where (coalesce(p_search, '') = ''
    or p.name ilike '%' || p_search || '%'
    or coalesce(p.sku, '') ilike '%' || p_search || '%'
    or coalesce(p.slug, '') ilike '%' || p_search || '%'
    or exists (
      select 1 from public.product_variants v
      where v.product_id = p.id and v.sku ilike '%' || p_search || '%'
    ))
    and (coalesce(p_category, '') = '' or p.category = p_category)
    and (coalesce(p_status, '') = '' or p.status = p_status)
  order by p.created_at desc;
end;
$$;

revoke all on function public.search_admin_products(text, text, text) from public, anon;
grant execute on function public.search_admin_products(text, text, text) to authenticated;

create or replace function public.rename_product_category(p_category_id uuid, p_name text, p_slug text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  previous_name text;
begin
  if not (select private.is_staff()) then
    raise exception 'Acesso negado: perfil ADMIN ou RH necessário.';
  end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_slug), '') = '' then
    raise exception 'Informe o nome e o endereço da categoria.';
  end if;

  select name into previous_name
  from public.categories where id = p_category_id for update;
  if not found then raise exception 'Categoria não encontrada.'; end if;

  update public.categories set name = trim(p_name), slug = trim(p_slug) where id = p_category_id;
  update public.products
  set category = trim(p_name), updated_at = now()
  where category_id = p_category_id or (category_id is null and category = previous_name);
end;
$$;

revoke all on function public.rename_product_category(uuid, text, text) from public, anon;
grant execute on function public.rename_product_category(uuid, text, text) to authenticated;

create or replace function public.delete_product_category(p_category_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  category_name text;
begin
  if not (select private.is_staff()) then
    raise exception 'Acesso negado: perfil ADMIN ou RH necessário.';
  end if;

  select name into category_name
  from public.categories where id = p_category_id for update;
  if not found then raise exception 'Categoria não encontrada.'; end if;
  if exists (
    select 1 from public.products
    where category_id = p_category_id or category = category_name
  ) then
    raise exception 'Esta categoria ainda está vinculada a produtos. Reatribua-os antes de excluir.';
  end if;
  delete from public.categories where id = p_category_id;
end;
$$;

revoke all on function public.delete_product_category(uuid) from public, anon;
grant execute on function public.delete_product_category(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_staff_read on storage.objects;
create policy product_images_staff_read on storage.objects
  for select to authenticated
  using (bucket_id = 'product-images' and (select private.is_staff()));

drop policy if exists product_images_published_read on storage.objects;
create policy product_images_published_read on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1
      from public.product_images i
      join public.products p on p.id = i.product_id
      where i.storage_path = storage.objects.name and p.status = 'active'
    )
  );

drop policy if exists product_images_staff_insert on storage.objects;
create policy product_images_staff_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (select private.is_staff())
    and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  );

drop policy if exists product_images_staff_update on storage.objects;
create policy product_images_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and (select private.is_staff()))
  with check (bucket_id = 'product-images' and (select private.is_staff()));

drop policy if exists product_images_staff_delete on storage.objects;
create policy product_images_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (select private.is_staff()));

comment on table public.product_variants is
  'Product variants manage size/color-specific SKU, price and inventory.';
comment on column public.product_images.storage_path is
  'Path of the image object in the private product-images Storage bucket.';
