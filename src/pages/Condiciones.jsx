import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LuPenLine } from 'react-icons/lu';
import ColumnaTexto, { PaginaCondiciones, TEXTO_PEQUENO } from '../components/condiciones/ColumnaTexto';
import Banner from '../components/condiciones/Banner';
import TemaGrid from '../components/condiciones/TemaGrid';
import DocumentoTerminos from '../components/condiciones/DocumentoTerminos';
import FormularioFirma from '../components/condiciones/FormularioFirma';

export default function Condiciones() {
  const { hash } = useLocation();
  const [firmaVisible, setFirmaVisible] = useState(false);

  // Al llegar con #firmar, #terminos o #seccion-N (desde el menú o desde un tema), baja a ese punto.
  useEffect(() => {
    if (!hash) return;
    let activo = true;
    const ir = () => activo && document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    // Se repite cuando terminan de cargar las fuentes, porque cambian el alto de la página.
    const temporizador = setTimeout(ir, 50);
    document.fonts?.ready.then(ir);
    return () => {
      activo = false;
      clearTimeout(temporizador);
    };
  }, [hash]);

  // La barra "Aceptar y firmar" se oculta cuando el formulario ya está en pantalla.
  useEffect(() => {
    const firma = document.getElementById('firmar');
    const observador = new IntersectionObserver(([entrada]) => setFirmaVisible(entrada.isIntersecting), {
      rootMargin: '0px 0px -30% 0px',
    });
    observador.observe(firma);
    return () => observador.disconnect();
  }, []);

  return (
    <PaginaCondiciones conBanner>
      <Banner
        id="condiciones-titulo"
        titulo="Términos, Condiciones y Requisitos"
        subtitulo="Esta es la información que debes tener en cuenta al adquirir un servicio de diagnóstico, mantenimiento y reparación."
      />

      <ColumnaTexto className="pt-10">
        <TemaGrid />

        <div className="mt-16">
          <DocumentoTerminos />
        </div>

        <div className="mt-4">
          <FormularioFirma />
        </div>
      </ColumnaTexto>

      <div
        className={`sticky bottom-0 z-40 mt-10 border-t border-gray-200 bg-white/95 py-3 backdrop-blur-md transition-all duration-300 sm:py-4 ${
          firmaVisible ? 'pointer-events-none translate-y-full opacity-0' : ''
        }`}
        aria-hidden={firmaVisible}
      >
        <ColumnaTexto className="flex items-center gap-4 sm:justify-between">
          <p className={`hidden ${TEXTO_PEQUENO} sm:block`}>¿Leíste las condiciones? Firma tu aceptación aquí mismo.</p>
          <a
            href="#firmar"
            tabIndex={firmaVisible ? -1 : undefined}
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#00162b] px-6 py-2 text-[15px] font-extrabold whitespace-nowrap text-white transition hover:bg-[#0a2b4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00162b] sm:w-auto"
          >
            <LuPenLine className="h-5 w-5" aria-hidden="true" />
            Aceptar y firmar
          </a>
        </ColumnaTexto>
      </div>
    </PaginaCondiciones>
  );
}
