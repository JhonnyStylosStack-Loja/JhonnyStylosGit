create table if not exists public.store_content (
  id boolean primary key default true check (id),
  hours jsonb not null default '{}'::jsonb,
  address text not null default '',
  reference text not null default '',
  maps_url text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  email text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.store_content enable row level security;
alter table public.store_content force row level security;
grant select on public.store_content to anon, authenticated;
grant insert, update on public.store_content to authenticated;

create policy store_content_public_read on public.store_content
  for select to anon, authenticated using (true);
create policy store_content_staff_insert on public.store_content
  for insert to authenticated with check ((select private.is_staff()));
create policy store_content_staff_update on public.store_content
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
