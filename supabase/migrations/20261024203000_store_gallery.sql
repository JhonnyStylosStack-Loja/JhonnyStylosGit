create table if not exists public.store_gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt text not null default '',
  position integer not null default 0,
  crop_x numeric(5,2) not null default 50 check (crop_x between 0 and 100),
  crop_y numeric(5,2) not null default 50 check (crop_y between 0 and 100),
  crop_zoom numeric(4,2) not null default 1 check (crop_zoom between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists store_gallery_images_position_idx on public.store_gallery_images (position);
alter table public.store_gallery_images enable row level security;
alter table public.store_gallery_images force row level security;
grant select on public.store_gallery_images to anon, authenticated;
grant insert, update, delete on public.store_gallery_images to authenticated;

create policy store_gallery_public_read on public.store_gallery_images
  for select to anon, authenticated using (true);
create policy store_gallery_staff_manage on public.store_gallery_images
  for all to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('store-gallery', 'store-gallery', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy store_gallery_object_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'store-gallery' and exists (
    select 1 from public.store_gallery_images i where i.storage_path = storage.objects.name
  ));
create policy store_gallery_object_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'store-gallery' and (select private.is_staff()));
create policy store_gallery_object_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'store-gallery' and (select private.is_staff()))
  with check (bucket_id = 'store-gallery' and (select private.is_staff()));
create policy store_gallery_object_staff_delete on storage.objects
  for delete to authenticated using (bucket_id = 'store-gallery' and (select private.is_staff()));
