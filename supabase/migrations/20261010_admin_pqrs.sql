-- Ejecutar después de schema.sql en Supabase → SQL Editor.
-- Migra también las filas existentes y se puede ejecutar de nuevo.
begin;

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

-- Actualización e historial en una sola transacción; bloqueo y comparación para evitar sobrescrituras.
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
