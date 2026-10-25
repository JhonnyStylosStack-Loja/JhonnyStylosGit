insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-media', 'blog-media', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy blog_media_public_read on storage.objects
  for select using (bucket_id = 'blog-media');
create policy blog_media_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-media' and (select private.is_staff()));
create policy blog_media_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-media' and (select private.is_staff()))
  with check (bucket_id = 'blog-media' and (select private.is_staff()));
create policy blog_media_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-media' and (select private.is_staff()));
