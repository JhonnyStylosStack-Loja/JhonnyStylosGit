-- Applies policy/index hardening to databases that already ran product_management.
create index if not exists categories_parent_id_idx on public.categories (parent_id);

drop policy if exists catalog_public_read on public.products;
create policy catalog_public_read on public.products
  for select to anon, authenticated using (status = 'active' or (select private.is_staff()));
drop policy if exists catalog_public_read on public.product_images;
create policy catalog_public_read on public.product_images
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_images.product_id and p.status = 'active') or (select private.is_staff()));
drop policy if exists catalog_public_read on public.product_variants;
create policy catalog_public_read on public.product_variants
  for select to anon, authenticated
  using ((is_active and exists (select 1 from public.products p where p.id = product_variants.product_id and p.status = 'active')) or (select private.is_staff()));

drop policy if exists catalog_staff_manage on public.products;
create policy catalog_staff_insert on public.products for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.products for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.products for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_staff_manage on public.product_images;
create policy catalog_staff_insert on public.product_images for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.product_images for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.product_images for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_staff_manage on public.product_variants;
create policy catalog_staff_insert on public.product_variants for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.product_variants for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.product_variants for delete to authenticated using ((select private.is_staff()));

drop policy if exists catalog_staff_manage on public.categories;
create policy catalog_staff_insert on public.categories for insert to authenticated with check ((select private.is_staff()));
create policy catalog_staff_update on public.categories for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy catalog_staff_delete on public.categories for delete to authenticated using ((select private.is_staff()));
