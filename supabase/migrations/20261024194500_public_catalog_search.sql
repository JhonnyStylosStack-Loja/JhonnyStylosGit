-- Server-side catalog search: one lightweight card row per active product.
create index if not exists products_active_category_price_idx
  on public.products (category, price, created_at desc)
  where status = 'active';
create index if not exists product_variants_active_product_color_size_idx
  on public.product_variants (product_id, lower(color), lower(size))
  where is_active;

create or replace function public.search_catalog_products(
  p_search text default null,
  p_categories text[] default null,
  p_collection_ids uuid[] default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_sizes text[] default null,
  p_colors text[] default null,
  p_min_rating numeric default null,
  p_new_only boolean default false,
  p_sort text default 'default',
  p_page integer default 1,
  p_page_size integer default 24
)
returns table (
  id uuid, name text, category text, price numeric, original_price numeric,
  rating numeric, review_count integer, tags text[], image_path text, total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with filtered as (
    select p.*
    from public.products p
    where p.status = 'active'
      and (coalesce(trim(p_search), '') = '' or p.name ilike '%' || trim(p_search) || '%' or coalesce(p.sku, '') ilike '%' || trim(p_search) || '%')
      and (coalesce(cardinality(p_categories), 0) = 0 or p.category = any(p_categories))
      and (coalesce(cardinality(p_collection_ids), 0) = 0 or exists (
        select 1 from public.product_collections pc where pc.product_id = p.id and pc.collection_id = any(p_collection_ids)
      ))
      and (p_min_price is null or p.price >= p_min_price)
      and (p_max_price is null or p.price <= p_max_price)
      and (p_min_rating is null or p.rating >= p_min_rating)
      and (not p_new_only or 'NOVO' = any(p.tags))
      and (coalesce(cardinality(p_sizes), 0) = 0 or exists (
        select 1 from public.product_variants v where v.product_id = p.id and v.is_active
          and lower(v.size) = any(array(select lower(x) from unnest(p_sizes) x))
      ))
      and (coalesce(cardinality(p_colors), 0) = 0 or exists (
        select 1 from public.product_variants v where v.product_id = p.id and v.is_active
          and lower(v.color) = any(array(select lower(x) from unnest(p_colors) x))
      ))
  )
  select p.id, p.name, p.category, p.price, p.original_price, p.rating, p.review_count, p.tags,
         image.storage_path, count(*) over ()
  from filtered p
  left join lateral (
    select i.storage_path from public.product_images i
    where i.product_id = p.id
    order by i.is_primary desc, i.position asc
    limit 1
  ) image on true
  order by
    case when p_sort = 'price-asc' then p.price end asc nulls last,
    case when p_sort = 'price-desc' then p.price end desc nulls last,
    case when p_sort = 'rating' then p.rating end desc nulls last,
    p.created_at desc, p.id desc
  limit least(greatest(coalesce(p_page_size, 24), 1), 48)
  offset (greatest(coalesce(p_page, 1), 1) - 1) * least(greatest(coalesce(p_page_size, 24), 1), 48);
$$;

revoke all on function public.search_catalog_products(text, text[], uuid[], numeric, numeric, text[], text[], numeric, boolean, text, integer, integer) from public;
grant execute on function public.search_catalog_products(text, text[], uuid[], numeric, numeric, text[], text[], numeric, boolean, text, integer, integer) to anon, authenticated;

create or replace function public.get_catalog_facets()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'min_price', coalesce((select min(price) from public.products where status = 'active'), 0),
    'max_price', coalesce((select max(price) from public.products where status = 'active'), 0),
    'sizes', coalesce((select jsonb_agg(value order by value) from (select distinct v.size as value from public.product_variants v join public.products p on p.id = v.product_id where v.is_active and p.status = 'active' and v.size <> '') s), '[]'::jsonb),
    'colors', coalesce((select jsonb_agg(value order by value) from (select distinct v.color as value from public.product_variants v join public.products p on p.id = v.product_id where v.is_active and p.status = 'active' and v.color <> '') c), '[]'::jsonb)
  );
$$;
revoke all on function public.get_catalog_facets() from public;
grant execute on function public.get_catalog_facets() to anon, authenticated;
