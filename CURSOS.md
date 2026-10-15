# Landing de cursos

La página `/ricardo-academy` conserva el HTML, CSS, JavaScript, imágenes, contenido y variantes de la entrega `landing-placas`. Sus archivos están en `public/ricardo-academy/`; no recibe los estilos globales de React. El menú principal incluye **Cursos** y realiza una navegación de documento completo.

## Rutas

Los enlaces anteriores bajo `/cursos` redirigen de forma permanente a `/ricardo-academy`, conservando las subrutas y los parámetros de consulta.

- `/ricardo-academy` y `/ricardo-academy/`: landing del curso.
- `/ricardo-academy/gracias.html`: página postcompra con nombre, mensaje preparado y botón para abrir WhatsApp y adjuntar el comprobante.
- `/ricardo-academy/terminos.html`, `/ricardo-academy/reembolsos.html` y `/ricardo-academy/datos-personales.html`: documentos propios del curso.
- `?v=A` y `?v=B`: variantes originales. La variante B es la predeterminada.

Vite sirve la landing mediante el middleware de `vite.config.js`, tanto en desarrollo como en preview. En Vercel, las reglas de `vercel.json` resuelven `/ricardo-academy` antes de la aplicación React. Las imágenes, hojas de estilo y scripts usan rutas absolutas bajo `/ricardo-academy/`, por lo que no dependen de la barra final. `npm run build` copia los documentos a `dist/ricardo-academy/`.

## Configuración conservada

Editar `public/ricardo-academy/js/config.js` para cambiar fechas, precios, pagos, videos o medición. El dominio de referencia es `https://gotfix.co/ricardo-academy`. La entrega fija el inicio para el 2 de noviembre de 2026 y el cierre de preventa para el 25 de octubre a las 23:59:59, hora de Colombia.

El enlace de preventa de Wompi viene configurado. En el comercio de Wompi, la URL de retorno debe apuntar a `https://gotfix.co/ricardo-academy/gracias.html`. Esta configuración externa no se modifica desde el repositorio.

## Pendientes que ya venían en la entrega

- Enlace de pago y monto en COP del precio normal (desde el 26 de octubre).
- `leadWebhookUrl`: sin configurar, el formulario continúa a WhatsApp y no guarda el contacto en un CRM.
- Textos legales de compra, reembolsos y tratamiento de datos: contienen avisos de pendiente; no equivalen a los términos del servicio de reparación.
- Video de la variante A, testimonios, evidencia e identificadores de medición.

Se conserva `mostrarPlaceholders: true`, como en el material recibido. No se inventaron políticas, testimonios ni integraciones externas.

## Validación local

Ejecutar `npm run dev -- --host 127.0.0.1 --port 5175` y abrir `http://127.0.0.1:5175/ricardo-academy`. Para comprobar la salida de producción, ejecutar `npm run build` y `npm run preview`.

Los scripts clásicos recibidos se conservan sin convertirlos a módulos React. Se comprueba su sintaxis con `node --check public/ricardo-academy/js/config.js` y `node --check public/ricardo-academy/js/main.js`; ESLint valida la aplicación, la integración y el nuevo `postcompra.js`.

## Página postcompra

Conserva las fuentes y tokens de la landing, con estilos propios en `css/postcompra.css`. Permite corregir el nombre (precargado desde el formulario previo cuando existe), ver el texto y abrir el borrador de WhatsApp al número de `js/config.js`. El comprador adjunta y envía su comprobante en WhatsApp. No hay redirección automática que interrumpa la escritura del nombre.

Wompi devuelve `?id=<transacción>`. `js/postcompra.js` consulta `/api/academy-pago`, que utiliza `WOMPI_PRIVATE_KEY` exclusivamente en el servidor. Configurar esa variable en Vercel y volver a desplegar para activar la consulta. Una llave `prv_test_` usa Sandbox y `prv_prod_` usa producción. Nunca usar prefijo `VITE_` ni añadir la llave al JavaScript público.

La [documentación vigente de Wompi](https://docs.wompi.co/docs/colombia/transacciones/) requiere una llave privada para consultar transacciones. Se sustituyó la consulta directa del navegador que venía en la entrega. La respuesta al navegador contiene únicamente ID, estado, monto y moneda. No se devuelve información personal del pagador.

Se distinguen pago aprobado, pendiente, rechazado/anulado/error y consulta no disponible. Sin ID, sin configuración, ante timeout o fallo del proveedor, se ofrece confirmación manual por comprobante. Solo una respuesta `APPROVED` del servidor registra `Purchase` si se configuran los identificadores de medición; visitar la página o añadir `status=APPROVED` a la URL no registra una compra. Esta pantalla no concede acceso automático a clases.

En Vite se puede revisar el diseño y el flujo manual; Vite no ejecuta las funciones `/api`. Para probar la consulta real usar Vercel o `vercel dev`. Las pruebas de interfaz pueden simular sus respuestas sin hacer pagos ni enviar mensajes. La consulta y el retorno real del comercio requieren verificación después de configurar Wompi y desplegar.
