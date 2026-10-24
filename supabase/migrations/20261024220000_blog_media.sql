alter table public.blog_posts
  add column if not exists cover_crop_x numeric(5,2) not null default 50 check (cover_crop_x between 0 and 100),
  add column if not exists cover_crop_y numeric(5,2) not null default 50 check (cover_crop_y between 0 and 100),
  add column if not exists cover_crop_zoom numeric(4,2) not null default 1 check (cover_crop_zoom between 1 and 3),
  add column if not exists gallery jsonb not null default '[]'::jsonb;
