import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import { rutaTema, temas } from '../data/temas';
import { silabear } from '../utils/silabas';
import ColumnaTexto, { PaginaCondiciones, TEXTO, TEXTO_JUSTIFICADO, TITULO } from '../components/condiciones/ColumnaTexto';
import VideoTema from '../components/condiciones/VideoTema';
import PuntosClave from '../components/condiciones/PuntosClave';
import NavTemas from '../components/condiciones/NavTemas';
import CtaDudas from '../components/condiciones/CtaDudas';

// Plantilla única para /condiciones/:tema, llenada desde src/data/temas.js.
export default function TemaCondicion() {
  const { tema: slug } = useParams();
  const tema = temas.find((t) => t.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!tema) return <Navigate to="/condiciones" replace />;
  if (tema.ruta) return <Navigate to={rutaTema(tema)} replace />;

  return (
    <PaginaCondiciones>
      <ColumnaTexto as="article">
        <Link
          to="/condiciones"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#0067b8] transition hover:text-[#00162b]"
        >
          <LuArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Condiciones
        </Link>

        <h1 className={`mt-6 ${TITULO}`}>{tema.titulo}</h1>
        <p className={`mt-3 ${TEXTO}`}>{tema.resumen}</p>

        <div className="mt-8">
          <VideoTema key={tema.slug} enlace={tema.video} formato={tema.formatoVideo} titulo={tema.titulo} />
        </div>

        <ul className={`mt-10 list-disc space-y-4 pl-6 marker:text-[#00162b] ${TEXTO_JUSTIFICADO}`}>
          {tema.contenido.map((parrafo) => (
            <li key={parrafo} className="pl-1">
              {silabear(parrafo)}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <PuntosClave puntos={tema.puntosClave} />
        </div>

        <div className="mt-12 border-t border-gray-200 pt-10">
          <NavTemas slug={tema.slug} />
        </div>

        <div className="mt-10">
          <CtaDudas seccion={tema.seccionRelacionada} />
        </div>
      </ColumnaTexto>
    </PaginaCondiciones>
  );
}
