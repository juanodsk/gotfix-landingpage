# Ricardo Academy

- **Modo:** Persuade en la landing; Operate en el retorno postcompra.
- **Alcance:** integración literal de la landing entregada y ampliación autorizada de su página de retorno postcompra; sin rediseño de la landing principal ni cambio del sistema visual global.
- **Autoridad visual y de contenido:** `C:/Users/juanp/Downloads/landing-placas-entrega/landing-placas`. Conservar HTML, CSS, JavaScript, fuentes, imágenes, claims y comportamiento de la landing principal. Las adaptaciones de integración corresponden a rutas bajo `/ricardo-academy/`, dominio `https://gotfix.co/ricardo-academy` y acceso desde el menú existente. La excepción autorizada es `gracias.html`, ampliada con estilos y lógica separados para agradecer la compra y preparar el contacto por WhatsApp.
- **Artefacto:** `public/ricardo-academy/`, documento independiente de React y sus estilos globales.

## Apariencia observada

El CSS recibido describe un banco de taller y un manual de servicio. Su paleta principal utiliza dorado `#F5B942`, negro `#0B0B0C`, grafito `#131315`, panel `#18181B`, fondos claros `#F7F5F0` y `#EEEAE0`, y tinta `#111113`. El dorado para texto sobre fondo claro es `#7A5000`.

Los títulos usan Barlow Condensed, el cuerpo IBM Plex Sans y las cifras y rótulos IBM Plex Mono, con los respaldos definidos en el CSS original. El cuerpo mide 17px con interlineado 1.6; el título principal declara `clamp(42px, 12vw, 76px)` y los títulos de sección `clamp(34px, 9vw, 56px)`. El contenedor principal llega a 1140px, con margen interior base de 16px; las secciones declaran 72px de espacio vertical. Estos datos describen esta entrega y no son reglas para otras superficies.

## Integración y configuración

- `/ricardo-academy` y `/ricardo-academy/` sirven `public/ricardo-academy/index.html` mediante Vite en desarrollo/preview y las reglas de Vercel en despliegue.
- Documentos auxiliares: `/ricardo-academy/gracias.html`, `/ricardo-academy/terminos.html`, `/ricardo-academy/reembolsos.html` y `/ricardo-academy/datos-personales.html`.
- **Cursos** en `src/components/Navbar.jsx` usa `NavLink` con `reloadDocument` en ambos menús.
- `public/ricardo-academy/js/config.js` concentra precios, fechas, enlaces, videos y medición. Variante B predeterminada; `?v=A` y `?v=B` conservan las variantes originales.
- La devolución de Wompi debe configurarse externamente como `https://gotfix.co/ricardo-academy/gracias.html`.
- [CURSOS.md](../../CURSOS.md) detalla operación, validación y pendientes: pago normal y monto COP; webhook/CRM; textos legales; video A, testimonios, evidencia e identificadores de medición. Se conserva `mostrarPlaceholders: true`.

## Retorno postcompra

`gracias.html` conserva los negros, dorado, hueso y fuentes de la academia. `css/postcompra.css` añade una composición de dos columnas en escritorio; hasta 740px ordena bienvenida, formulario y pasos. La superficie permite completar una tarea: corregir el nombre, revisar el mensaje y abrir WhatsApp para confirmar la inscripción con el asesor.

`js/postcompra.js` precarga el nombre desde `sessionStorage.lp_lead` cuando existe y actualiza la vista previa del mensaje con nombre, compra y referencia disponible. El formulario GET abre el borrador en `wa.me` usando `whatsappNumero` de `config.js` (actualmente `573133068507`). El comprador adjunta su comprobante y decide enviarlo allí. No hay redirección automática ni concesión automática de acceso a clases.

La consulta usa `/api/academy-pago`: la variable `WOMPI_PRIVATE_KEY` permanece exclusivamente en el servidor y su configuración en el despliegue está pendiente. La API devuelve únicamente ID, estado, monto y moneda. `APPROVED` muestra aprobación; `PENDING`, espera; `DECLINED`, `VOIDED` y `ERROR`, pago no aprobado con opción de reintento. Sin ID, sin clave, ante timeout o fallo se conserva la confirmación manual por comprobante; cuando corresponde se ofrece volver a consultar. Solo `APPROVED` verificado por el servidor permite registrar `Purchase` con medición configurada; se evita repetirlo en la visita y, si hay almacenamiento disponible, al recargar.

## Evidencia de conservación

Comparación SHA256 de original e integrado realizada el 15 de octubre de 2026:

- `css/styles.css`: `944F9E430996E1CE12185EA106D26AF073F012983DB7298AB4CB15CE2D41B8A4` en ambas carpetas.
- `js/main.js`: `49DB572271C5466EFD48513875DFEED0C512D485D6AC70A326C98F87540CC6E7` en ambas carpetas.

Los hashes se comprobaron de nuevo tras ampliar la postcompra y conservan estos valores. La extensión se limita a `gracias.html`, `css/postcompra.css`, `js/postcompra.js` y la API descrita; no modifica el CSS ni la lógica principal de la landing.

El cierre de implementación reporta 26 pruebas, lint y build correctos, además del flujo de navegador con respuestas simuladas. Esta ficha se contrastó con los cuatro artefactos de postcompra, `config.js` y la sección «Página postcompra» de `CURSOS.md`. No se realizaron pagos ni mensajes reales; siguen pendientes la configuración de Wompi y la verificación del proveedor y retorno en producción.

No se convierten recursos específicos de la entrega en reglas globales, ni se repara el contexto histórico de PQRS en `PRODUCT.md`. Esta ficha no sustituye los archivos normativos existentes ni afirma validación en producción.
