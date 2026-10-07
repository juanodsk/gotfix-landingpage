import { LuCheck } from 'react-icons/lu';
import { MensajeError } from './Campo';

// Casilla de verificación con un área de toque amplia.
export default function Casilla({ id, checked, onChange, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 transition ${
          error ? 'border-red-500' : checked ? 'border-[#0087fa]/60 bg-[#0087fa]/[0.06]' : 'border-gray-300'
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-[1.5px] border-gray-400 bg-white transition peer-checked:border-[#0087fa] peer-checked:bg-[#0087fa] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0087fa]/50"
        >
          {checked && <LuCheck className="h-3 w-3 text-white" />}
        </span>
        <span className="text-[14px] leading-snug">{children}</span>
      </label>
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}
