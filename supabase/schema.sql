-- ==========================================================================
-- GOTFIX · Centro de Condiciones — estructura de la base de datos en Supabase
-- Cópialo completo en Supabase → SQL Editor → New query → Run.
-- Se puede ejecutar más de una vez sin dañar nada.
-- Para habilitar /admin, ejecuta después migrations/20261010_admin_pqrs.sql.
-- ==========================================================================

-- 1. Aceptaciones de Términos y Condiciones (página /formulario)
create table if not exists public.aceptaciones_terminos (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  documento        text not null,
  correo           text not null,
  whatsapp         text not null,
  equipo           text not null,
  orden            text,
  version_terminos text not null,
  hash_terminos    text not null,          -- huella SHA-256 del texto exacto aceptado
  firma_url        text not null,          -- ruta privada: firmas/AAAA/<id>/firma.png (el PDF queda al lado)
  ip               text,
  user_agent       text,
  creado_en        timestamptz not null default now()
);
create index if not exists aceptaciones_terminos_documento_idx on public.aceptaciones_terminos (documento);
create index if not exists aceptaciones_terminos_creado_idx on public.aceptaciones_terminos (creado_en desc);

-- 2. PQRS (página /pqrs)
create table if not exists public.pqrs (
  id              uuid primary key default gen_random_uuid(),
  radicado        text not null unique,
  nombre          text not null,
  documento       text not null,
  correo          text not null,
  whatsapp        text not null,
  orden           text,
  tipo            text check (tipo in ('peticion', 'queja', 'reclamo', 'garantia')),  -- opcional: el formulario actual no lo pide
  descripcion     text not null,
  adjuntos        jsonb not null default '[]'::jsonb,  -- [{ ruta, nombre, tamano, tipo }] en el bucket pqrs-adjuntos
  paso_por_tienda boolean not null default false,
  estado          text not null default 'radicado'
                  check (estado in ('radicado', 'en_tramite', 'respondido', 'cerrado')),
  creado_en       timestamptz not null default now()
);
create index if not exists pqrs_creado_idx on public.pqrs (creado_en desc);
-- Por si la tabla se creó con una versión anterior de este archivo (tipo era obligatorio):
alter table public.pqrs alter column tipo drop not null;

-- 3. Consecutivo del radicado (PQRS-2026-0001, PQRS-2026-0002, ...; reinicia cada año)
create table if not exists public.pqrs_consecutivos (
  anio   int primary key,
  ultimo int not null default 0
);

create or replace function public.siguiente_radicado()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anio int := extract(year from (now() at time zone 'America/Bogota'))::int;
  v_num  int;
begin
  -- La fila se bloquea durante la actualización: dos envíos simultáneos nunca reciben el mismo número.
  insert into pqrs_consecutivos (anio, ultimo) values (v_anio, 1)
  on conflict (anio) do update set ultimo = pqrs_consecutivos.ultimo + 1
  returning ultimo into v_num;
  return format('PQRS-%s-%s', v_anio, lpad(v_num::text, greatest(4, length(v_num::text)), '0'));
end;
$$;

-- 4. Seguridad: RLS activado y SIN políticas → nadie puede leer ni escribir desde el navegador.
--    Solo las funciones de Vercel (con una Secret key que usa el rol service_role) acceden.
alter table public.aceptaciones_terminos enable row level security;
alter table public.pqrs                  enable row level security;
alter table public.pqrs_consecutivos     enable row level security;

revoke all on public.aceptaciones_terminos, public.pqrs, public.pqrs_consecutivos from anon, authenticated;
revoke execute on function public.siguiente_radicado() from public, anon, authenticated;
grant execute on function public.siguiente_radicado() to service_role;

-- 5. Almacenamiento privado (Storage). Sin políticas públicas: solo el servidor sube y descarga.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('firmas',        'firmas',        false, 5242880,  array['image/png', 'application/pdf']),
  ('pqrs-adjuntos', 'pqrs-adjuntos', false, 20971520, array['image/*', 'video/*'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
