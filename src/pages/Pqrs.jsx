import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuCircleCheck, LuCopy, LuInfo, LuPaperclip, LuX } from 'react-icons/lu';
import { temas } from '../data/temas';
import { MAX_ADJUNTOS_BYTES, validarPqrs } from '../utils/validaciones';
import { pedirSubidaPqrs, radicarPqrs, subirArchivo } from '../utils/api';
import { interpretarVideo } from '../utils/video';
import ColumnaTexto, { PaginaCondiciones, TEXTO, TEXTO_PEQUENO, TITULO } from '../components/condiciones/ColumnaTexto';
import Banner, { OvaloBanner } from '../components/condiciones/Banner';
import VideoTema from '../components/condiciones/VideoTema';
import CtaDudas from '../components/condiciones/CtaDudas';
import Campo, { MensajeError } from '../components/forms/Campo';
import Casilla from '../components/forms/Casilla';

const temaPqrs = temas.find((t) => t.slug === 'pqrs');

const VACIO = {
  nombre: '',
  documento: '',
  correo: '',
  whatsapp: '',
  orden: '',
  descripcion: '',
  pasoPorTienda: false,
  sitioWeb: '', // campo trampa contra robots
};

const ORDEN_CAMPOS = ['nombre', 'documento', 'correo', 'whatsapp', 'orden', 'descripcion', 'adjuntos'];
const mb = (bytes) => `${(bytes / 1024 / 1024).toLocaleString('es-CO', { maximumFractionDigits: 1 })} MB`;

export default function Pqrs() {
  const [valores, setValores] = useState(VACIO);
  const [archivos, setArchivos] = useState([]);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState(''); // '', 'subiendo', 'radicando'
  const [progreso, setProgreso] = useState(0);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const inputArchivos = useRef(null);

  const totalBytes = archivos.reduce((s, a) => s + a.size, 0);

  const cambiar = (campo) => (valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (errores[campo]) setErrores(({ [campo]: _, ...resto }) => resto);
  };
  const alEscribir = (campo) => (e) => cambiar(campo)(e.target.value);

  const agregarArchivos = (e) => {
    const nuevos = [...e.target.files];
    e.target.value = '';
    setArchivos((prev) => [...prev, ...nuevos]);
    setErrores(({ adjuntos: _, ...resto }) => resto);
  };
  const quitarArchivo = (i) => setArchivos((prev) => prev.filter((_, j) => j !== i));

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    const { errores: errs } = validarPqrs(valores, archivos);
    setErrores(errs);
    if (Object.keys(errs).length) {
      const primero = ORDEN_CAMPOS.find((c) => errs[c]);
      const el = document.getElementById(primero === 'adjuntos' ? 'adjuntos-boton' : primero);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }

    try {
      let subida = {};
      if (archivos.length) {
        setEstado('subiendo');
        setProgreso(0);
        const { subidaId, token, urls } = await pedirSubidaPqrs(archivos);
        let subidos = 0;
        for (const [i, archivo] of archivos.entries()) {
          await subirArchivo(urls[i], archivo, (cargado) => setProgreso((subidos + cargado) / totalBytes));
          subidos += archivo.size;
        }
        subida = { subidaId, token };
      }
      setEstado('radicando');
      const respuesta = await radicarPqrs({ ...valores, ...subida });
      setResultado(respuesta);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error.errores) setErrores(error.errores);
      setErrorGeneral(error.message);
    } finally {
      setEstado('');
    }
  };

  const copiarRadicado = async () => {
    try {
      await navigator.clipboard.writeText(resultado.radicado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* el número sigue visible en pantalla */
    }
  };

  if (resultado) {
    return (
      <PaginaCondiciones>
        <ColumnaTexto className="text-center">
          <LuCircleCheck className="mx-auto h-16 w-16 text-[#25d366]" aria-hidden="true" />
          <h1 className={`mt-6 ${TITULO}`}>Tu caso quedó radicado</h1>
          <p className={`mt-3 ${TEXTO}`}>Tu número de radicado es:</p>
          <div role="status" className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#fcbc18] py-3 pr-3 pl-5 sm:gap-3 sm:py-4 sm:pl-6">
            <span className="text-[22px] font-extrabold tracking-wide whitespace-nowrap text-[#fcbc18] sm:text-[30px] md:text-[34px]">
              {resultado.radicado}
            </span>
            <button
              type="button"
              onClick={copiarRadicado}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#00162b]"
              aria-label="Copiar número de radicado"
            >
              <LuCopy className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className={`mt-2 h-5 ${TEXTO_PEQUENO} text-[#25d366]`} aria-live="polite">
            {copiado ? 'Copiado' : ''}
          </p>
          <p className={`mx-auto mt-3 max-w-[520px] ${TEXTO}`}>
            Guárdalo para hacer seguimiento.{' '}
            {resultado.correoEnviado
              ? 'También te lo enviamos a tu correo.'
              : 'No pudimos enviarte la confirmación por correo, pero tu caso sí quedó registrado.'}{' '}
            Te responderemos dentro de los plazos que fija la ley.
          </p>
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#fcbc18] px-6 py-2 text-[15px] font-extrabold text-[#00162b] transition hover:brightness-105"
            >
              Ir al inicio
            </Link>
          </div>
        </ColumnaTexto>
      </PaginaCondiciones>
    );
  }

  const ocupado = Boolean(estado);

  return (
    <PaginaCondiciones conBanner>
      {/* Banner oscuro: deja claro que este es el canal oficial de PQRS. */}
      <Banner
        id="pqrs-titulo"
        titulo="PQRS"
        subtitulo="Canal oficial de GOTFIX para radicar peticiones, quejas y reclamos sobre nuestros servicios."
      >
        {temaPqrs.contenido.map((p) => (
          <OvaloBanner key={p}>{p}</OvaloBanner>
        ))}
      </Banner>

      <ColumnaTexto className="pt-10">
        {interpretarVideo(temaPqrs.video) && (
          <div className="mb-8">
            <VideoTema enlace={temaPqrs.video} formato={temaPqrs.formatoVideo} titulo={temaPqrs.titulo} />
          </div>
        )}

        <form onSubmit={enviar} noValidate className="space-y-4">
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <Campo id="nombre" etiqueta="Nombre completo" autoComplete="name" value={valores.nombre} onChange={alEscribir('nombre')} error={errores.nombre} className="sm:col-span-2" />
            <Campo id="documento" etiqueta="Cédula o NIT" inputMode="numeric" value={valores.documento} onChange={alEscribir('documento')} error={errores.documento} />
            <Campo id="whatsapp" etiqueta="WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="312 504 2689" value={valores.whatsapp} onChange={alEscribir('whatsapp')} error={errores.whatsapp} />
            <Campo id="correo" etiqueta="Correo electrónico" type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" value={valores.correo} onChange={alEscribir('correo')} error={errores.correo} />
            <Campo id="orden" etiqueta="N.º de orden de servicio" opcional value={valores.orden} onChange={alEscribir('orden')} error={errores.orden} />
            <Campo
              id="descripcion"
              as="textarea"
              etiqueta="Describe tu caso"
              placeholder="Cuéntanos qué pasó, cuándo y qué solución esperas."
              maxLength={3000}
              value={valores.descripcion}
              onChange={alEscribir('descripcion')}
              error={errores.descripcion}
              className="sm:col-span-2"
            />
          </div>

          <div>
            <p className="mb-1 text-[13px] font-extrabold text-[#00162b]">
              Fotos o video <span className="ml-1 font-light text-gray-500">(opcional, máximo 20 MB en total)</span>
            </p>
            <input ref={inputArchivos} type="file" accept="image/*,video/*" multiple onChange={agregarArchivos} className="sr-only" tabIndex={-1} aria-hidden="true" />
            <button
              id="adjuntos-boton"
              type="button"
              onClick={() => inputArchivos.current.click()}
              aria-describedby={errores.adjuntos ? 'adjuntos-error' : undefined}
              className={`flex min-h-9 w-full items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed px-3 py-1.5 text-[14px] text-[#0067b8] transition hover:border-[#0087fa] hover:bg-[#0087fa]/[0.06] ${
                errores.adjuntos ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <LuPaperclip className="h-5 w-5" aria-hidden="true" /> Adjuntar fotos o video
            </button>
            {archivos.length > 0 && (
              <ul className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200">
                {archivos.map((a, i) => (
                  <li key={`${a.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2 text-[14px]">
                    <span className="min-w-0 truncate">{a.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-gray-500">{mb(a.size)}</span>
                      <button
                        type="button"
                        onClick={() => quitarArchivo(i)}
                        className="rounded-md p-1.5 transition hover:bg-gray-100 hover:text-[#00162b]"
                        aria-label={`Quitar ${a.name}`}
                      >
                        <LuX className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </span>
                  </li>
                ))}
                <li className={`px-4 py-2 text-right text-[14px] ${totalBytes > MAX_ADJUNTOS_BYTES ? 'text-red-600' : 'text-gray-500'}`}>
                  Total: {mb(totalBytes)} de 20 MB
                </li>
              </ul>
            )}
            <MensajeError id="adjuntos-error" error={errores.adjuntos} />
          </div>

          <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
            <label htmlFor="sitioWeb">No llenar este campo</label>
            <input id="sitioWeb" tabIndex={-1} autoComplete="off" value={valores.sitioWeb} onChange={alEscribir('sitioWeb')} />
          </div>

          <Casilla id="pasoPorTienda" checked={valores.pasoPorTienda} onChange={cambiar('pasoPorTienda')}>
            Ya me acerqué a la tienda y no recibí solución.
          </Casilla>

          {errorGeneral && (
            <p role="alert" className="flex gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              <LuInfo className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {errorGeneral}
            </p>
          )}

          <button
            type="submit"
            disabled={ocupado}
            className="min-h-10 w-full rounded-md bg-[#00162b] px-6 py-2 text-[15px] font-extrabold text-white transition hover:bg-[#0a2b4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00162b] disabled:cursor-wait disabled:opacity-70"
          >
            {estado === 'subiendo'
              ? `Subiendo archivos… ${Math.round(progreso * 100)} %`
              : estado === 'radicando'
                ? 'Radicando…'
                : 'Radicar mi caso'}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <CtaDudas seccion={temaPqrs.seccionRelacionada} />
        </div>
      </ColumnaTexto>
    </PaginaCondiciones>
  );
}
