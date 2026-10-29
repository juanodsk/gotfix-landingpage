-- GOTFIX / Ricardo Academy: interesados que completan el formulario de contacto.
-- Ejecutar completo en el SQL Editor del mismo Supabase usado por GOTFIX.
-- No borra datos; puede ejecutarse más de una vez.
begin;

create table if not exists public.curso_contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(btrim(nombre)) between 2 and 160),
  correo text not null check (char_length(correo) between 3 and 254 and position('@' in correo) > 1),
  pais text not null check (char_length(btrim(pais)) between 2 and 100),
  whatsapp text not null check (whatsapp ~ '^\+?[0-9]{10,15}$'),
  experiencia text not null check (experiencia in ('recambios_iphone', 'android', 'microsoldadura', 'otro')),
  curso text not null default 'Reparación de placas de iPhone',
  variante text not null default 'B' check (variante in ('A', 'B')),
  cta text check (char_length(cta) <= 100),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  creado_en timestamptz not null default now()
);

create index if not exists curso_contactos_creado_idx on public.curso_contactos (creado_en desc, id desc);

-- Sin políticas públicas: el navegador no puede consultar ni escribir la tabla.
alter table public.curso_contactos enable row level security;
revoke all on table public.curso_contactos from public, anon, authenticated;
grant select, insert on table public.curso_contactos to service_role;

commit;
