import { Link } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { rutaTema, temas } from '../../data/temas';

// Botones "Tema anterior / Siguiente tema" para recorrer los temas en orden.
export default function NavTemas({ slug }) {
  const i = temas.findIndex((t) => t.slug === slug);
  const anterior = temas[i - 1];
  const siguiente = temas[i + 1];
  const estilo =
    'group flex flex-1 flex-col gap-1 rounded-xl border border-gray-200 px-5 py-4 transition hover:border-[#0087fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0087fa]';

  return (
    <nav aria-label="Recorrer temas" className="flex flex-col gap-3 sm:flex-row">
      {anterior ? (
        <Link to={rutaTema(anterior)} className={estilo}>
          <span className="flex items-center gap-1.5 text-[14px] text-[#0067b8]">
            <LuArrowLeft className="h-4 w-4" aria-hidden="true" /> Tema anterior
          </span>
          <span className="font-extrabold text-[#00162b]">{anterior.titulo}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {siguiente ? (
        <Link to={rutaTema(siguiente)} className={`${estilo} sm:items-end sm:text-right`}>
          <span className="flex items-center gap-1.5 text-[14px] text-[#0067b8]">
            Siguiente tema <LuArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-extrabold text-[#00162b]">{siguiente.titulo}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
