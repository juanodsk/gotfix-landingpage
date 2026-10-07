import { TEXTO } from './ColumnaTexto';

// Banner oscuro de ancho completo para el encabezado de Condiciones y PQRS.
// Usar dentro de <PaginaCondiciones conBanner> para que quede pegado al menú.
export default function Banner({ id, titulo, subtitulo, children }) {
  return (
    <section
      aria-labelledby={id}
      className="relative overflow-hidden bg-[#00162b] bg-[radial-gradient(ellipse_at_top,rgba(0,135,250,0.28),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(0,135,250,0.12),transparent_55%)] px-4 py-12 text-center md:py-16"
    >
      <p className="text-[13px] font-extrabold tracking-[0.18em] text-[#0087fa] uppercase">GOTFIX · Neiva, Huila</p>
      {/* En un solo renglón: el tamaño se calcula con el ancho de la pantalla y el largo del
          título (un carácter en Arial negrita mide ~0,55 veces la letra), hasta 40 px. */}
      <h1
        id={id}
        className="mt-3 leading-tight font-extrabold whitespace-nowrap text-white"
        style={{ fontSize: `clamp(14px, calc((100vw - 40px) / ${Math.max(titulo.length * 0.57, 6).toFixed(1)}), 40px)` }}
      >
        {titulo}
      </h1>
      {subtitulo && <p className={`mx-auto mt-3 max-w-[560px] text-balance text-[#d4d4d4] ${TEXTO}`}>{subtitulo}</p>}
      {children}
    </section>
  );
}

// Recuadro ovalado translúcido para un mensaje dentro del banner.
export function OvaloBanner({ children }) {
  return (
    <p className="mx-auto mt-6 max-w-[560px] rounded-3xl border border-white/20 bg-white/10 px-6 py-3 text-[13px] leading-normal text-balance text-white sm:rounded-full">
      {children}
    </p>
  );
}
