import { LuChevronDown } from 'react-icons/lu';

// Campos de formulario compactos. La letra va en 16 px: con menos, Safari en iPhone y iPad
// agranda la página al tocar el campo.
const base =
  'w-full rounded-md border bg-white px-3 text-[16px] font-light text-[#00162b] placeholder:text-gray-500 transition outline-none focus:border-[#0087fa] focus:ring-2 focus:ring-[#0087fa]/25';

export default function Campo({ id, etiqueta, error, ayuda, opcional, as = 'input', className = '', ...props }) {
  const Control = as;
  const descripcion = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const alto = as === 'textarea' ? 'min-h-24 py-2' : 'h-9';
  const borde = error ? 'border-red-500' : 'border-gray-300';
  const extra = as === 'select' ? 'appearance-none pr-10' : '';

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[13px] font-extrabold text-[#00162b]">
        {etiqueta}
        {opcional && <span className="ml-1.5 font-light text-gray-500">(opcional)</span>}
      </label>
      <div className="relative">
        <Control
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={descripcion}
          className={`${base} ${alto} ${borde} ${extra}`}
          {...props}
        />
        {as === 'select' && (
          <LuChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#0087fa]"
          />
        )}
      </div>
      {ayuda && (
        <p id={`${id}-ayuda`} className="mt-1 text-[13px] text-gray-500">
          {ayuda}
        </p>
      )}
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}

export function MensajeError({ id, error }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-[13px] text-red-600">
      {error}
    </p>
  );
}
