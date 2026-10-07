import { LuCheck } from 'react-icons/lu';
import { SUBTITULO, TEXTO } from './ColumnaTexto';

export default function PuntosClave({ puntos }) {
  return (
    <aside aria-labelledby="puntos-clave-titulo" className="rounded-2xl border border-[#0087fa]/35 bg-[#0087fa]/[0.08] p-6 md:p-7">
      <h2 id="puntos-clave-titulo" className={`mb-3 ${SUBTITULO}`}>
        Lo más importante
      </h2>
      <ul className="space-y-2">
        {puntos.map((punto) => (
          <li key={punto} className={`flex gap-3 ${TEXTO}`}>
            <LuCheck className="mt-1.5 h-4 w-4 shrink-0 text-[#0087fa]" aria-hidden="true" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
