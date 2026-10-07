import { useRef, useState } from 'react';
import { LuCircleCheck, LuInfo } from 'react-icons/lu';
import { terminos } from '../../data/terminos';
import { validarFirma } from '../../utils/validaciones';
import { enviarFirma } from '../../utils/api';
import Campo from '../forms/Campo';
import FirmaCanvas from '../forms/FirmaCanvas';
import { SUBTITULO, TEXTO, TEXTO_JUSTIFICADO, TEXTO_PEQUENO } from './ColumnaTexto';
import { silabear } from '../../utils/silabas';

// Formulario de aceptación y firma digital. Va al final de la página /condiciones (#firmar).
const VACIO = {
  nombre: '',
  documento: '',
  correo: '',
  whatsapp: '',
  equipo: '',
  orden: '',
  sitioWeb: '', // campo trampa contra robots: las personas no lo ven
};

const ORDEN_CAMPOS = ['nombre', 'documento', 'correo', 'whatsapp', 'equipo', 'orden', 'firma'];

// No hay casillas: al firmar y pulsar "Aceptar y firmar" el cliente acepta los Términos y autoriza
// el tratamiento de datos (así lo dicen la declaración de arriba y la nota bajo el botón).
const CONSENTIMIENTOS = { aceptaTerminos: true, autorizaDatos: true };

function crearFirmaTipografica(nombre) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 320;
  const contexto = canvas.getContext('2d');
  contexto.fillStyle = '#00162b';
  contexto.font = 'italic 82px Georgia, serif';
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillText(nombre, canvas.width / 2, canvas.height / 2, canvas.width - 100);
  return canvas.toDataURL('image/png');
}

export default function FormularioFirma() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [hayFirma, setHayFirma] = useState(false);
  const [firmaEscrita, setFirmaEscrita] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [resultado, setResultado] = useState(null);
  const firmaRef = useRef(null);
  const seccionRef = useRef(null);

  const cambiar = (campo) => (valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (errores[campo]) setErrores(({ [campo]: _, ...resto }) => resto);
  };
  const alEscribir = (campo) => (e) => cambiar(campo)(e.target.value);
  const irAlInicio = () => seccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const enfocarPrimerError = (errs) => {
    const primero = ORDEN_CAMPOS.find((c) => errs[c]);
    const el = document.getElementById(primero === 'firma' ? 'firma-etiqueta' : primero);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (primero !== 'firma') el?.focus({ preventScroll: true });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    const tieneFirma = hayFirma || (firmaEscrita && valores.nombre.trim());
    const { errores: errs } = validarFirma({ ...valores, ...CONSENTIMIENTOS, firma: tieneFirma ? 'si' : '' });
    setErrores(errs);
    if (Object.keys(errs).length) return enfocarPrimerError(errs);

    setEnviando(true);
    try {
      const respuesta = await enviarFirma({
        ...valores,
        ...CONSENTIMIENTOS,
        firma: hayFirma ? firmaRef.current.aImagen() : crearFirmaTipografica(valores.nombre.trim()),
        version: terminos.version,
      });
      setResultado(respuesta);
      requestAnimationFrame(irAlInicio);
    } catch (error) {
      if (error.errores) {
        setErrores(error.errores);
        enfocarPrimerError(error.errores);
      }
      setErrorGeneral(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const otraFirma = () => {
    setValores(VACIO);
    setErrores({});
    setHayFirma(false);
    setFirmaEscrita(false);
    setResultado(null);
    requestAnimationFrame(irAlInicio);
  };

  return (
    <section id="firmar" ref={seccionRef} aria-labelledby="firmar-titulo" className="scroll-mt-28 border-t-2 border-[#0087fa] pt-10">
      {resultado ? (
        <div className="py-6 text-center">
          <LuCircleCheck className="mx-auto h-16 w-16 text-[#25d366]" aria-hidden="true" />
          <h2 id="firmar-titulo" role="status" className={`mt-6 ${SUBTITULO}`}>
            {resultado.correoEnviado ? 'Listo, te enviamos una copia a tu correo' : 'Listo, tu aceptación quedó registrada'}
          </h2>
          <p className={`mx-auto mt-3 max-w-[520px] ${TEXTO}`}>
            {resultado.correoEnviado
              ? 'Revisa tu bandeja de entrada (y la carpeta de spam). Ahí encontrarás el PDF con los términos aceptados y tu firma.'
              : 'No pudimos enviar la copia a tu correo en este momento. Tu firma está guardada; si necesitas el PDF, pídelo en la tienda.'}
          </p>
          <button
            type="button"
            onClick={otraFirma}
            className="mt-6 min-h-10 rounded-md bg-[#fcbc18] px-6 py-2 text-[15px] font-extrabold text-[#00162b] transition hover:brightness-105"
          >
            Registrar otra firma
          </button>
        </div>
      ) : (
        <>
          <h2 id="firmar-titulo" className={SUBTITULO}>
            Por favor llena el formulario y acepta los términos y condiciones
          </h2>
          <p className={`mt-3 ${TEXTO_JUSTIFICADO}`}>{silabear(terminos.aceptacion.texto)}</p>
          <p className={`mt-2 ${TEXTO_PEQUENO} text-gray-500`}>Completa tus datos y firma. Te enviaremos una copia en PDF a tu correo.</p>

          <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
            <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
              <Campo id="nombre" etiqueta="Nombre completo" autoComplete="name" value={valores.nombre} onChange={alEscribir('nombre')} error={errores.nombre} className="sm:col-span-2" />
              <Campo id="documento" etiqueta="Cédula o NIT" inputMode="numeric" value={valores.documento} onChange={alEscribir('documento')} error={errores.documento} />
              <Campo id="whatsapp" etiqueta="WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="312 504 2689" value={valores.whatsapp} onChange={alEscribir('whatsapp')} error={errores.whatsapp} />
              <Campo id="correo" etiqueta="Correo electrónico" type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" value={valores.correo} onChange={alEscribir('correo')} error={errores.correo} className="sm:col-span-2" />
              <Campo id="equipo" etiqueta="Equipo (modelo)" placeholder="Ej.: iPhone 13 Pro" value={valores.equipo} onChange={alEscribir('equipo')} error={errores.equipo} />
              <Campo id="orden" etiqueta="N.º de orden de servicio" opcional value={valores.orden} onChange={alEscribir('orden')} error={errores.orden} />
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
              <label htmlFor="sitioWeb">No llenar este campo</label>
              <input id="sitioWeb" tabIndex={-1} autoComplete="off" value={valores.sitioWeb} onChange={alEscribir('sitioWeb')} />
            </div>

            <FirmaCanvas
              ref={firmaRef}
              error={errores.firma}
              onCambio={(hay) => {
                setHayFirma(hay);
                if (hay) setFirmaEscrita(false);
                if (hay && errores.firma) setErrores(({ firma: _, ...resto }) => resto);
              }}
            />

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[13px] text-gray-600">
                Si no puedes dibujar la firma, puedes usar tu nombre completo como firma electrónica.
              </p>
              <button
                type="button"
                disabled={!valores.nombre.trim()}
                aria-pressed={firmaEscrita}
                onClick={() => {
                  firmaRef.current?.borrar();
                  setHayFirma(false);
                  setFirmaEscrita(true);
                  if (errores.firma) setErrores(({ firma: _, ...resto }) => resto);
                }}
                className="mt-2 min-h-10 w-full rounded-md border border-[#0067b8] px-4 py-2 text-[14px] font-extrabold text-[#0067b8] transition hover:bg-[#0067b8] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067b8] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-500"
              >
                {firmaEscrita ? 'Nombre usado como firma' : 'Usar mi nombre como firma'}
              </button>
            </div>

            {errorGeneral && (
              <p role="alert" className={`flex gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 ${TEXTO_PEQUENO} text-red-700`}>
                <LuInfo className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {errorGeneral}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="min-h-10 w-full rounded-md bg-[#00162b] px-6 py-2 text-[15px] font-extrabold text-white transition hover:bg-[#0a2b4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00162b] disabled:cursor-wait disabled:opacity-70"
            >
              {enviando ? 'Enviando…' : 'Aceptar y firmar'}
            </button>
            <p className={`text-center ${TEXTO_PEQUENO} text-gray-500`}>
              Al pulsar «Aceptar y firmar» aceptas los{' '}
              <a href="#terminos" className="text-[#0067b8] underline underline-offset-2 hover:text-[#00162b]">
                Términos y Condiciones
              </a>{' '}
              (versión {terminos.version}) y autorizas el tratamiento de tus datos personales.
            </p>
          </form>
        </>
      )}
    </section>
  );
}
