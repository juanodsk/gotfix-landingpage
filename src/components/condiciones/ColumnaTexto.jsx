// Columna centrada de 760 px que comparten todas las páginas del Centro de Condiciones,
// para que títulos, párrafos y listas tengan siempre el mismo margen izquierdo.
export default function ColumnaTexto({ as: Etiqueta = 'div', className = '', children, ...props }) {
  return (
    <Etiqueta className={`mx-auto w-full max-w-[760px] px-4 ${className}`} {...props}>
      {children}
    </Etiqueta>
  );
}

// Escala tipográfica única del Centro de Condiciones: usar siempre estas clases para que
// títulos, subtítulos y textos tengan el mismo tamaño en todas las páginas.
export const TITULO = 'text-[24px] leading-tight font-extrabold text-[#00162b] md:text-[32px]';
export const SUBTITULO = 'text-[18px] leading-snug font-extrabold text-[#00162b] md:text-[20px]';
export const TEXTO = 'text-[15px] leading-[1.7] md:text-[16px]';
export const TEXTO_PEQUENO = 'text-[13px] leading-normal';

// Texto corrido: alineado a la izquierda y sin guiones en todas las pantallas (decisión de GOTFIX).
// hyphens-none también ignora los guiones invisibles de silabear(). Para volver al justificado
// en iPad y computador: `text-left hyphens-none sm:text-justify sm:hyphens-auto ${TEXTO}`.
export const TEXTO_JUSTIFICADO = `text-left hyphens-none ${TEXTO}`;

// Al copiar texto de la página, quita los guiones invisibles que agrega silabear() para
// justificar; así lo que el cliente pegue en WhatsApp o en un correo queda limpio.
function copiarSinGuionesInvisibles(e) {
  const seleccion = window.getSelection()?.toString() ?? '';
  if (!seleccion.includes('­')) return;
  e.preventDefault();
  e.clipboardData.setData('text/plain', seleccion.replace(/­/g, ''));
}

// Fondo y tipografía base de las páginas nuevas: fondo blanco, texto gris y Arial (fuente del
// sistema, sobria para textos legales; el header y el footer del sitio conservan Karst).
export function PaginaCondiciones({ children, conBanner = false }) {
  return (
    <main
      lang="es"
      onCopy={copiarSinGuionesInvisibles}
      className={`min-h-screen bg-white pb-20 font-[Arial,Helvetica,sans-serif] font-normal text-gray-700 [&_.font-extrabold]:font-bold [&_.font-light]:font-normal ${
        conBanner ? '' : 'pt-12 md:pt-16'
      }`}
    >
      {children}
    </main>
  );
}
