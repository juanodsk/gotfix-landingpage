import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { LuEraser } from 'react-icons/lu';
import { MensajeError } from './Campo';

// Recuadro de firma con el dedo o el mouse. Conserva el trazo si cambia el tamaño de la pantalla
// (al girar la tablet o cuando el navegador del celular muestra u oculta su barra).
const FirmaCanvas = forwardRef(function FirmaCanvas({ error, onCambio }, ref) {
  const firmaRef = useRef(null);
  const anchoRef = useRef(0);

  useImperativeHandle(ref, () => ({
    estaVacia: () => firmaRef.current.isEmpty(),
    // PNG recortado al trazo, con fondo transparente.
    aImagen: () => firmaRef.current.getTrimmedCanvas().toDataURL('image/png'),
    borrar: () => firmaRef.current.clear(),
  }));

  useEffect(() => {
    const firma = firmaRef.current;
    if (!firma) return undefined;

    const canvas = firma.getCanvas();
    let activo = true;
    const ajustar = () => {
      if (!activo || !canvas.isConnected || !firmaRef.current) return;
      const ancho = canvas.offsetWidth;
      if (ancho === anchoRef.current) return; // solo cambia el alto: no hace falta redibujar
      anchoRef.current = ancho;
      const trazos = firma.toData();
      const escala = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = ancho * escala;
      canvas.height = canvas.offsetHeight * escala;
      canvas.getContext('2d').scale(escala, escala);
      firma.fromData(trazos);
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(canvas);
    return () => {
      activo = false;
      observador.disconnect();
    };
  }, []);

  const borrar = () => {
    firmaRef.current.clear();
    onCambio?.(false);
  };

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <p id="firma-etiqueta" className="text-[13px] font-extrabold text-[#00162b]">
          Firma
        </p>
        <button
          type="button"
          onClick={borrar}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-[#0067b8] transition hover:bg-[#0087fa]/5 hover:text-[#00162b] focus-visible:outline-2 focus-visible:outline-[#0087fa]"
        >
          <LuEraser className="h-4 w-4" aria-hidden="true" /> Borrar firma
        </button>
      </div>
      <div
        className={`relative overflow-hidden rounded-xl border-2 bg-gray-50 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <SignatureCanvas
          ref={firmaRef}
          clearOnResize={false}
          penColor="#00162b"
          minWidth={0.8}
          maxWidth={2}
          onEnd={() => onCambio?.(true)}
          canvasProps={{
            className: 'block h-20 w-full touch-none md:h-24',
            role: 'img',
            'aria-labelledby': 'firma-etiqueta',
            'aria-describedby': error ? 'firma-error' : 'firma-ayuda',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-5 border-b border-dashed border-[#00162b]/25" />
      </div>
      <p id="firma-ayuda" className="mt-1 text-[13px] text-gray-500">
        Firma con tu dedo o con el mouse sobre la línea.
      </p>
      <MensajeError id="firma-error" error={error} />
    </div>
  );
});

export default FirmaCanvas;
