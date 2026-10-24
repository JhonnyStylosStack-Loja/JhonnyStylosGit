alter table public.store_content
  add column if not exists cta_eyebrow text not null default '',
  add column if not exists cta_title text not null default '',
  add column if not exists cta_description text not null default '',
  add column if not exists cta_whatsapp_url text not null default '',
  add column if not exists cta_shop_url text not null default '';
