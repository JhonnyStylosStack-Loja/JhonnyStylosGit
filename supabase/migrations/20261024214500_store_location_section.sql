alter table public.store_content
  add column if not exists how_title text not null default '',
  add column if not exists how_description text not null default '',
  add column if not exists how_checklist jsonb not null default '[]'::jsonb,
  add column if not exists how_map_label text not null default '',
  add column if not exists how_directions_url text not null default '';
