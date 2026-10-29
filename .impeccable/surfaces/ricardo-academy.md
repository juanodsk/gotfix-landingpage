# Ricardo Academy

- **Modo:** Persuade en la landing; Operate en el retorno postcompra.
- **Alcance:** integración de la landing entregada, ampliación autorizada de su retorno postcompra e incorporación y optimización de cuatro testimonios suministrados por el usuario para reducir la espera después de pulsar play; sin rediseño de la landing principal ni cambio del sistema visual global.
- **Autoridad visual y de contenido:** `C:/Users/juanp/Downloads/landing-placas-entrega/landing-placas`, más los cuatro videos suministrados. Conservar el mundo visual, fuentes, imágenes y claims de la entrega. Las adaptaciones de integración corresponden a rutas bajo `/ricardo-academy/`, dominio `https://gotfix.co/ricardo-academy` y acceso desde el menú existente. Las ampliaciones autorizadas son `gracias.html`, con estilos y lógica separados, y los testimonios, con configuración, copias MP4 optimizadas, portadas extraídas de los videos y cambios acotados en carga, reproducción, recuperación y cuadrícula adaptable.
- **Artefacto:** `public/ricardo-academy/`, documento independiente de React y sus estilos globales.

## Apariencia observada

El CSS recibido describe un banco de taller y un manual de servicio. Su paleta principal utiliza dorado `#F5B942`, negro `#0B0B0C`, grafito `#131315`, panel `#18181B`, fondos claros `#F7F5F0` y `#EEEAE0`, y tinta `#111113`. El dorado para texto sobre fondo claro es `#7A5000`.

Los títulos usan Barlow Condensed, el cuerpo IBM Plex Sans y las cifras y rótulos IBM Plex Mono, con los respaldos definidos en el CSS original. El cuerpo mide 17px con interlineado 1.6; el título principal declara `clamp(42px, 12vw, 76px)` y los títulos de sección `clamp(34px, 9vw, 56px)`. El contenedor principal llega a 1140px, con margen interior base de 16px; las secciones declaran 72px de espacio vertical. Estos datos describen esta entrega y no son reglas para otras superficies.

## Integración y configuración

La oferta ahora mantiene únicamente US$257 (COP 817.466 en Wompi), sin paso automático a US$470 ni comparación de ahorro. El hero usa el retrato existente de Ricardo en lugar del arte con fechas y precios vencidos. El píxel de Meta `2349540535781835` registra `PageView` en la landing e `InitiateCheckout` al salir hacia Wompi desde los botones de inscripción, incluido el hero señalado por el usuario; su base se carga una sola vez y el respaldo `noscript` cubre visitas sin JavaScript.

Por solicitud del usuario se retiraron de la landing el bloque «Desde el laboratorio» con sus cuatro placeholders, el aviso «AGRUPACIÓN PROVISIONAL – VALIDAR» y la navegación legal del footer. El temario, instructor, testimonios y los documentos auxiliares conservan su contenido.

- `/ricardo-academy` y `/ricardo-academy/` sirven `public/ricardo-academy/index.html` mediante Vite en desarrollo/preview y las reglas de Vercel en despliegue.
- Documentos auxiliares: `/ricardo-academy/gracias.html`, `/ricardo-academy/terminos.html`, `/ricardo-academy/reembolsos.html` y `/ricardo-academy/datos-personales.html`.
- Por solicitud del usuario, se retiró **Cursos** de los menús de escritorio y móvil en `src/components/Navbar.jsx`; la URL directa de la academia sigue disponible.
- `public/ricardo-academy/js/config.js` concentra precios, fechas, enlaces, videos y medición. Variante B predeterminada; `?v=A` y `?v=B` conservan las variantes originales.
- La devolución de Wompi debe configurarse externamente como `https://gotfix.co/ricardo-academy/gracias.html`.
- [CURSOS.md](../../CURSOS.md) detalla operación, validación y pendientes: pago normal y monto COP; webhook/CRM; textos legales; video A, evidencia e identificadores de medición. Los cuatro testimonios suministrados ya están configurados. Se conserva `mostrarPlaceholders: true` para el material restante.

## Testimonios en video

Corrección de entrega en producción: los MP4 de `public/ricardo-academy/videos/` quedan excluidos de Git LFS para que Vercel reciba los binarios reales. Las nuevas URLs `720p-web` evitan la caché de los punteros de texto entregados anteriormente. Los controles, códecs y calidad de imagen se conservan.

Camilo F., Juan, Kevin y Yan Carlos aparecen en `/ricardo-academy#prueba`. `video` y `poster` en `js/config.js` apuntan a archivos locales de `public/ricardo-academy/videos/`; `original` conserva cada URL firmada de Supabase para recuperación. No se añaden citas ni países. Los MP4 usan H.264 a 720 × 1280/30fps y audio AAC, con `faststart`; las portadas WebP proceden del segundo 0,3 de los videos reales.

Los reproductores mantienen controles nativos, `playsinline` y nombre accesible. Comienzan con `preload="none"`; `IntersectionObserver` cambia a `preload="auto"` cuando están a 240px de entrar en pantalla para preparar el búfer antes del clic. Si `navigator.connection.saveData` indica ahorro de datos, se limita a `metadata`. Sin ese observador se aplica directamente la misma selección de precarga. Al reproducir uno se pausan los demás. Por solicitud del usuario, se retiró el aviso con enlace al archivo original ante errores. Por solicitud del usuario, los videos se presentan sin nombres visibles ni tarjetas blancas: se retiraron fondo, borde y relleno exterior; se conservan los marcos del reproductor y los nombres accesibles; la cuadrícula presenta una columna en móvil, dos desde 640px y cuatro desde 1200px cuando hay cuatro testimonios.

Los cuatro MP4 suman 23.396.401 bytes frente a 234.231.530 bytes de los MOV originales (aproximadamente 90 % menos); las portadas suman 84.440 bytes. Los ocho nombres incorporan hash de contenido. `vercel.json` aplica caché inmutable a la carpeta de videos: generar nombres nuevos y actualizar `video`/`poster` al cambiar material, sin sobrescribir esos nombres. `src/scripts/optimizarTestimonios.mjs` reproduce la conversión mediante FFmpeg local o `FFMPEG_PATH`; originales y herramientas temporales permanecen en `output/playwright/`, ignorado por Git. La conversión no forma parte de la ejecución de la web ni del despliegue.

## Retorno postcompra

`gracias.html` conserva los negros, dorado, hueso y fuentes de la academia. `css/postcompra.css` añade una composición de dos columnas en escritorio; hasta 740px ordena bienvenida, formulario y pasos. La superficie permite completar una tarea: corregir el nombre, revisar el mensaje y abrir WhatsApp para confirmar la inscripción con el asesor.

`js/postcompra.js` precarga el nombre desde `sessionStorage.lp_lead` cuando existe y actualiza la vista previa del mensaje con nombre, compra y referencia disponible. El formulario GET abre el borrador en `wa.me` usando `whatsappNumero` de `config.js` (actualmente `573133068507`). El comprador adjunta su comprobante y decide enviarlo allí. No hay redirección automática ni concesión automática de acceso a clases.

La consulta usa `/api/academy-pago`: la variable `WOMPI_PRIVATE_KEY` permanece exclusivamente en el servidor y su configuración en el despliegue está pendiente. La API devuelve únicamente ID, estado, monto y moneda. `APPROVED` muestra aprobación; `PENDING`, espera; `DECLINED`, `VOIDED` y `ERROR`, pago no aprobado con opción de reintento. Sin ID, sin clave, ante timeout o fallo se conserva la confirmación manual por comprobante; cuando corresponde se ofrece volver a consultar. Solo `APPROVED` verificado por el servidor permite registrar `Purchase` con medición configurada; se evita repetirlo en la visita y, si hay almacenamiento disponible, al recargar.

## Evidencia de conservación

La conservación se refiere al diseño y contenido recibidos, con las ampliaciones autorizadas descritas. `styles.css` y `main.js` ya incluyen ajustes de testimonios y no son idénticos a la entrega original. Se contrastaron las fuentes, paleta y tarjetas del CSS vigente, la función `renderTestimonios`, la configuración de los cuatro videos, el script de conversión, la caché de Vercel y la documentación de optimización en `CURSOS.md`, sin reproducir los tokens de las URLs firmadas.

La validación de optimización reportada al cierre confirma H.264/AAC y el átomo `moov` antes de `mdat` en los cuatro MP4; petición Range con respuesta 206 y 1024 bytes, portadas con respuesta 200 y respeto de ahorro de datos. Se reprodujeron los cuatro videos en anchos de 1440, 1024 y 390px, sin errores ni desbordamiento. La pausa entre videos ya se había comprobado; el enlace de recuperación se retiró posteriormente por solicitud del usuario. Las comprobaciones de sintaxis, lint y build pasaron. Las capturas actualizadas conservaron el mundo visual.

Para el primer testimonio, una medición puntual en Chrome con limitación CDP de 1,5 Mbps/150ms y caché desactivada registró 12.554 → 3.687ms desde solicitar reproducción hasta el primer fotograma al llegar a la sección, y 6.471 → 45ms tras permanecer 5 segundos en ella. Compara MOV desde Supabase con MP4 desde servidor local. Es evidencia simulada local, no una prueba en teléfono físico ni garantía de reproducción instantánea; falta comprobar red y CDN después del despliegue.

El cierre de implementación de postcompra reporta 26 pruebas, lint y build correctos, además del flujo de navegador con respuestas simuladas. Esta ficha se contrastó con los cuatro artefactos de postcompra, `config.js` y la sección «Página postcompra» de `CURSOS.md`. No se realizaron pagos ni mensajes reales; siguen pendientes la configuración de Wompi y la verificación del proveedor y retorno en producción.

No se convierten recursos específicos de la entrega en reglas globales, ni se repara el contexto histórico de PQRS en `PRODUCT.md`. Esta ficha no sustituye los archivos normativos existentes ni afirma validación en producción.
