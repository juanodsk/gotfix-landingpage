import { Link } from 'react-router-dom';
import { rutaTema, temas } from '../../data/temas';
import IconoTema from './IconoTema';

export default function TemaGrid() {
  return (
    <nav aria-label="Temas de las condiciones">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {temas.map((tema) => (
          <li key={tema.slug} className="flex">
            <Link
              to={rutaTema(tema)}
              className="group flex min-h-[132px] w-full flex-col items-center justify-start gap-3 rounded-xl border border-gray-200 px-3 pt-6 pb-5 text-center transition hover:border-[#0087fa] hover:bg-[#0087fa]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0087fa]"
            >
              <IconoTema
                nombre={tema.icono}
                className="h-8 w-8 text-[#0087fa] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-[15px] leading-snug font-extrabold text-[#00162b]">{tema.titulo}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
