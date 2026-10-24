alter table public.store_content
  add column if not exists how_image_path text not null default '';

drop policy if exists store_gallery_object_read on storage.objects;
create policy store_gallery_object_read on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'store-gallery'
    and (
      exists (
        select 1 from public.store_gallery_images i
        where i.storage_path = storage.objects.name
      )
      or exists (
        select 1 from public.store_content c
        where c.id is true and c.how_image_path = storage.objects.name
      )
    )
  );
