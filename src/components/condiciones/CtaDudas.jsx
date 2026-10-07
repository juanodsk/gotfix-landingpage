import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

export const WHATSAPP_URL = 'https://wa.me/573125042689';

export default function CtaDudas({ seccion }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#25d366] px-6 py-2 text-[15px] font-extrabold text-[#00162b] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
      >
        <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
        ¿Tienes dudas? Escríbenos
      </a>
      <Link
        to={seccion ? `/condiciones#seccion-${seccion}` : '/condiciones#terminos'}
        className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-[#0067b8] px-6 py-2 text-[15px] font-extrabold text-[#0067b8] transition hover:bg-[#0067b8] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067b8]"
      >
        Ver términos completos
      </Link>
    </div>
  );
}
