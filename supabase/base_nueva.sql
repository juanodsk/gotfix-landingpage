-- GOTFIX: esquema completo para un proyecto NUEVO de Supabase.
-- Ejecutar completo en Supabase > SQL Editor > New query > Run.
-- Incluye schema.sql y migrations/20261010_admin_pqrs.sql, en ese orden.
-- No hace falta ejecutar esos archivos por separado después de este script.
-- Requiere los roles anon, authenticated y service_role y el esquema Storage
-- que Supabase proporciona. No es un instalador de Supabase en PostgreSQL puro.
-- Crea estructura y buckets; no copia registros, usuarios ni archivos anteriores.
-- El usuario administrador se crea desde Authentication y sus datos no van aquí.

begin;

-- PARTE 1: esquema inicial (supabase/schema.sql).
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

-- PARTE 2: estados e historial del panel (20261010_admin_pqrs.sql).
do $$
begin
  create type public.estado_pqr as enum ('radicado', 'en_tramite', 'respondido', 'cerrado');
exception when duplicate_object then null;
end $$;

alter table public.pqrs drop constraint if exists pqrs_estado_check;
alter table public.pqrs alter column estado drop default;
alter table public.pqrs alter column estado type public.estado_pqr using estado::text::public.estado_pqr;
alter table public.pqrs alter column estado set default 'radicado'::public.estado_pqr;
alter table public.pqrs add column if not exists actualizado_en timestamptz;
update public.pqrs set actualizado_en = creado_en where actualizado_en is null;
alter table public.pqrs alter column actualizado_en set default now();
alter table public.pqrs alter column actualizado_en set not null;
create index if not exists pqrs_estado_creado_idx on public.pqrs (estado, creado_en desc);

create table if not exists public.pqrs_seguimiento (
  id uuid primary key default gen_random_uuid(),
  pqr_id uuid not null references public.pqrs(id),
  estado_anterior public.estado_pqr not null,
  estado_nuevo public.estado_pqr not null,
  nota text not null default '' check (length(nota) <= 2000),
  admin_id uuid not null,
  admin_correo text not null,
  creado_en timestamptz not null default now()
);
create index if not exists pqrs_seguimiento_pqr_idx on public.pqrs_seguimiento (pqr_id, creado_en desc);
alter table public.pqrs_seguimiento enable row level security;
revoke all on public.pqrs_seguimiento from anon, authenticated;
grant all on public.pqrs_seguimiento to service_role;

create or replace function public.actualizar_estado_pqrs(
  p_id uuid, p_estado public.estado_pqr, p_estado_anterior public.estado_pqr,
  p_nota text, p_admin_id uuid, p_admin_correo text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_estado public.estado_pqr;
begin
  select estado into v_estado from public.pqrs where id = p_id for update;
  if not found then raise exception 'PQRS no encontrada' using errcode = 'P0002'; end if;
  if v_estado <> p_estado_anterior then raise exception 'Estado modificado por otro seguimiento' using errcode = '40001'; end if;
  if p_estado = v_estado and coalesce(trim(p_nota), '') = '' then
    raise exception 'Escribe una nota o cambia el estado' using errcode = '22023';
  end if;
  insert into public.pqrs_seguimiento (pqr_id, estado_anterior, estado_nuevo, nota, admin_id, admin_correo)
  values (p_id, v_estado, p_estado, trim(coalesce(p_nota, '')), p_admin_id, p_admin_correo);
  update public.pqrs set estado = p_estado, actualizado_en = now() where id = p_id;
end;
$$;

revoke execute on function public.actualizar_estado_pqrs(uuid, public.estado_pqr, public.estado_pqr, text, uuid, text) from public, anon, authenticated;
grant execute on function public.actualizar_estado_pqrs(uuid, public.estado_pqr, public.estado_pqr, text, uuid, text) to service_role;

commit;
