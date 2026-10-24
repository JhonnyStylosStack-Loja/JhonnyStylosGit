alter table public.store_content
  add column if not exists hero_tag text not null default '',
  add column if not exists hero_title text not null default '',
  add column if not exists hero_title_emphasis text not null default '',
  add column if not exists hero_description text not null default '',
  add column if not exists hero_address text not null default '',
  add column if not exists hero_image_url text not null default '',
  add column if not exists hero_whatsapp_url text not null default '',
  add column if not exists hero_whatsapp_label text not null default '',
  add column if not exists hero_shop_url text not null default '',
  add column if not exists hero_shop_label text not null default '';
