import { terminos } from '../../data/terminos';
import BloquesTerminos from './BloquesTerminos';
import { SUBTITULO, TEXTO_JUSTIFICADO, TEXTO_PEQUENO } from './ColumnaTexto';
import { silabear } from '../../utils/silabas';

const ETIQUETA = 'text-[13px] font-extrabold tracking-[0.18em] uppercase';

// Documento completo de Términos y Condiciones con índice; todas las secciones se muestran completas.
export default function DocumentoTerminos() {
  return (
    <article id="terminos" aria-labelledby="terminos-titulo" className="scroll-mt-28">
      <header className="border-b-2 border-[#0087fa] pb-6">
        <p className={`${ETIQUETA} text-[#0067b8]`}>{terminos.empresa}</p>
        <h2 id="terminos-titulo" className={`mt-2 ${SUBTITULO}`}>
          {terminos.titulo}
        </h2>
        <p className={`mt-1 ${TEXTO_PEQUENO} text-gray-500`}>Versión 2026 · Neiva, Huila</p>
      </header>

      <div className={`space-y-4 py-8 ${TEXTO_JUSTIFICADO}`}>
        {terminos.introduccion.map((parrafo, i) => (
          <p key={i}>{silabear(parrafo)}</p>
        ))}
      </div>

      {terminos.secciones.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="scroll-mt-28 border-t border-gray-200 py-8">
          <h3 id={`${s.id}-titulo`} className={`mb-4 flex gap-2 ${SUBTITULO}`}>
            <span>{s.numero}.</span>
            <span>{s.titulo}</span>
          </h3>
          <BloquesTerminos bloques={s.bloques} />
        </section>
      ))}
    </article>
  );
}
