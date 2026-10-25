create table if not exists public.novidades_content (
  id boolean primary key default true check (id),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.novidades_content enable row level security;
alter table public.novidades_content force row level security;
grant select on public.novidades_content to anon, authenticated;
grant insert, update on public.novidades_content to authenticated;

create policy novidades_content_public_read on public.novidades_content
  for select to anon, authenticated using (true);
create policy novidades_content_staff_insert on public.novidades_content
  for insert to authenticated with check ((select private.is_staff()));
create policy novidades_content_staff_update on public.novidades_content
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('novidades-media', 'novidades-media', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy novidades_media_public_read on storage.objects
  for select using (bucket_id = 'novidades-media');
create policy novidades_media_staff_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'novidades-media' and (select private.is_staff()));
create policy novidades_media_staff_update on storage.objects
  for update to authenticated using (bucket_id = 'novidades-media' and (select private.is_staff())) with check (bucket_id = 'novidades-media' and (select private.is_staff()));
create policy novidades_media_staff_delete on storage.objects
  for delete to authenticated using (bucket_id = 'novidades-media' and (select private.is_staff()));
