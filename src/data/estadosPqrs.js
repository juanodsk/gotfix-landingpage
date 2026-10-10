// Contrato compartido con public.estado_pqr en Supabase.
export const ESTADOS_PQRS = Object.freeze({
  radicado: 'Radicado',
  en_tramite: 'En trámite',
  respondido: 'Respondido',
  cerrado: 'Cerrado',
});

export const esEstadoPqrs = (estado) => typeof estado === 'string' && Object.hasOwn(ESTADOS_PQRS, estado);
