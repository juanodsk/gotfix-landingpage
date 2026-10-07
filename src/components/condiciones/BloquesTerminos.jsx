import { silabear } from '../../utils/silabas';
import { TEXTO_JUSTIFICADO } from './ColumnaTexto';

// Pinta los bloques de una sección de terminos.js (párrafos, subtítulos y listas).
export default function BloquesTerminos({ bloques }) {
  return (
    <div className={`space-y-4 ${TEXTO_JUSTIFICADO}`}>
      {bloques.map((bloque, i) => {
        if (bloque.tipo === 'subtitulo') {
          return (
            <h4 key={i} className="pt-3 text-left font-extrabold text-[#00162b]">
              {bloque.texto}
            </h4>
          );
        }
        if (bloque.tipo === 'lista') {
          return (
            <ul key={i} className="list-disc space-y-3 pl-6 marker:text-[#00162b]">
              {bloque.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {item.etiqueta && <strong className="font-extrabold text-[#00162b]">{item.etiqueta} </strong>}
                  {silabear(item.texto)}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{silabear(bloque.texto)}</p>;
      })}
    </div>
  );
}
