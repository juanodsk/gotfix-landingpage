// Temas del Centro de Condiciones (/condiciones/:slug), en el orden en que se recorren.
//
// CÓMO AGREGAR UN VIDEO: pega el enlace entre las comillas de "video". Sirve:
//   - YouTube:  "https://www.youtube.com/watch?v=XXXX", "https://youtu.be/XXXX" o "https://youtube.com/shorts/XXXX"
//   - Vimeo:    "https://vimeo.com/123456789"
//   - Archivo:  súbelo a /public/videos y escribe "/videos/nombre.mp4"
// Los Shorts y los .mp4 verticales se muestran en formato vertical automáticamente. Para forzar
// el formato, agrega  formatoVideo: "vertical"  o  formatoVideo: "horizontal".
//
// Los textos explican en lenguaje sencillo la sección indicada en "seccionRelacionada" de
// terminos.js. Lo que obliga legalmente es siempre el texto completo de los Términos.
// "icono" es el nombre de un ícono de react-icons/lu (ver src/components/condiciones/IconoTema.jsx).

export const temas = [
  {
    slug: 'diagnostico',
    titulo: 'Diagnóstico y cotización',
    icono: 'LuScanSearch',
    video: '',
    resumen: 'Antes de reparar, revisamos tu equipo y te enviamos una cotización clara para que decidas.',
    contenido: [
      'Cuando recibimos tu equipo, hacemos las pruebas necesarias para encontrar la falla. Luego te enviamos la cotización por WhatsApp o te la damos en la tienda.',
      'La cotización te dice qué tiene el equipo, qué se va a reparar, qué repuestos se usan, el precio, el tiempo estimado de entrega, la garantía y los riesgos técnicos. El valor puede ser definitivo o estimado, según el estado del equipo.',
      'Nada se repara sin tu autorización por escrito: por WhatsApp, correo electrónico o firma en la orden de servicio. Si durante la reparación aparece una falla adicional con un costo mayor, te consultamos antes de continuar.',
      'Si decides no reparar, o si el equipo no tiene solución, solo pagas el diagnóstico. Su valor queda registrado en la orden de servicio desde que recibimos el equipo.',
      'Para las pruebas podemos pedirte la contraseña o el código de desbloqueo. Solo se usa con fines técnicos: no revisamos tus fotos, archivos ni aplicaciones. Esto es importante al realizar la reparación.',
      'El tiempo de entrega es estimado: puede cambiar por la complejidad de la reparación o la disponibilidad de repuestos. Si cambia, te avisamos.',
    ],
    puntosClave: [
      'Nada se repara sin tu autorización por escrito.',
      'Si no apruebas la reparación, solo pagas el diagnóstico.',
      'Si aparece un costo adicional, te consultamos antes.',
    ],
    seccionRelacionada: 2,
  },
  {
    slug: 'reparacion',
    titulo: 'Reparación y repuestos',
    icono: 'LuWrench',
    video: '',
    resumen: 'Siempre sabrás qué repuesto se instala en tu equipo y qué implica.',
    contenido: [
      'Antes de instalar un repuesto te informamos si es nuevo, original, compatible, reacondicionado o recuperado.',
      'Algunos repuestos pueden mostrar mensajes del sistema o no tener todas las funciones del original, según el modelo, la versión o la región del equipo. En ese caso te lo advertimos y solo lo instalamos con tu autorización expresa.',
      'Las baterías infladas, deterioradas o en mal estado se desechan de inmediato con procedimientos seguros. Son un residuo peligroso, por eso no se devuelven.',
      'Haz una copia de seguridad antes de entregar tu equipo. GOTFIX no responde por pérdida de información causada por fallas propias o preexistentes del equipo, daños en sus componentes o procedimientos informados previamente.',
    ],
    puntosClave: [
      'Te decimos qué tipo de repuesto se instala.',
      'Si un repuesto tiene limitaciones, solo se instala con tu autorización.',
      'Haz una copia de seguridad antes de entregar el equipo.',
    ],
    seccionRelacionada: 4,
  },
  {
    slug: 'control-de-calidad',
    titulo: 'Control de calidad',
    icono: 'LuClipboardCheck',
    video: '',
    resumen: 'Registramos cómo llega tu equipo y probamos todo antes de entregarlo.',
    contenido: [
      'Cuando recibimos tu equipo, registramos su estado inicial con fotografías, videos o pruebas básicas.',
      'Al terminar la reparación probamos las cámaras, los sensores, la conectividad SIM y los demás componentes importantes.',
      'Grabamos un video del chequeo final, que podemos enviarte.',
      'Si no nos das acceso al equipo (contraseña o desbloqueo), las pruebas pueden ser parciales y no podremos responder por fallas que no fue posible detectar.',
      'Al recibir tu equipo, revísalo junto con sus accesorios y cuéntanos de inmediato cualquier observación.',
    ],
    puntosClave: [
      'Registramos el estado del equipo al recibirlo.',
      'Grabamos un video del chequeo final.',
      'Revisa tu equipo al recibirlo y avísanos de inmediato.',
    ],
    seccionRelacionada: 4,
  },
  {
    slug: 'alto-riesgo',
    titulo: 'Pantallas y alto riesgo',
    icono: 'LuSmartphone',
    video: '',
    resumen: 'Algunos equipos y reparaciones tienen un riesgo técnico propio que debes conocer.',
    contenido: [
      'Si el equipo llega apagado, mojado, golpeado o sin posibilidad de hacer pruebas completas, no es posible revisar todas sus funciones. Las fallas que aparezcan al encenderlo o durante la reparación se consideran preexistentes y no son responsabilidad de GOTFIX.',
      'Lo mismo aplica a reparaciones de conectores o sensores delicados, tapa posterior, Apple Watch y fallas de origen indeterminado.',
      'Restauración del cristal de pantalla: la pantalla (display) puede dañarse durante el proceso. Si pasa, hay que reemplazarla por una nueva, con otro precio, y el valor cotizado inicialmente se abona a la pantalla que elijas.',
      'Cristal trasero: si el equipo recibió un golpe, al desarmarlo pueden aparecer fallas que no se veían. Su reparación tiene un costo adicional que te consultamos antes.',
      'La garantía de cristales y lentes solo cubre que se despeguen por un defecto de adhesión de nuestra instalación. No cubre fisuras ni fracturas por golpes, presión, torsión o cambios de temperatura.',
    ],
    puntosClave: [
      'Las fallas que aparezcan en equipos apagados, mojados o golpeados se consideran preexistentes.',
      'Si la pantalla se daña al restaurar el cristal, lo cotizado se abona a una nueva.',
      'En cristales y lentes, la garantía cubre solo defectos de adhesión.',
    ],
    seccionRelacionada: 5,
  },
  {
    slug: 'garantia',
    titulo: 'Garantía',
    icono: 'LuShieldCheck',
    video: '',
    resumen: 'Cuánto dura la garantía, qué cubre y qué la anula.',
    contenido: [
      '6 meses si tu equipo no había sido reparado ni intervenido antes por terceros. 3 meses si ya fue reparado, abierto o intervenido por otro técnico o establecimiento.',
      'Al recibir el equipo nos dices si fue intervenido. Si encontramos señales de manipulación previa (tornillos, adhesivos o piezas no originales), aplica la garantía de 3 meses y dejamos registro.',
      'La garantía empieza el día de la entrega. Si no recoges el equipo en los 2 días siguientes al aviso de que está listo, se cuenta desde ese aviso.',
      'Cubre solo la pieza, el componente o la reparación que hizo GOTFIX. Para hacerla efectiva, hacemos una revisión técnica que determina si la falla tiene relación con el servicio.',
      'No cubre condiciones preexistentes, desgaste natural, golpes, caídas, líquidos, humedad ni uso inadecuado. En pantallas, no cubre fisuras, manchas, líneas o fallas táctiles por presión, golpes, caídas o líquidos, aunque el vidrio no se vea dañado. Si un tercero manipula el equipo después o se alteran nuestros sellos de seguridad, la garantía se anula.',
      'No tienen garantía: el mantenimiento preventivo, el mantenimiento por humedad, la restauración de software y la actualización del sistema operativo.',
    ],
    puntosClave: [
      '6 meses, o 3 meses si el equipo ya había sido intervenido.',
      'Cubre solo lo que reparó GOTFIX.',
      'Golpes, líquidos, mal uso o manipulación de terceros anulan la garantía.',
    ],
    seccionRelacionada: 6,
  },
  {
    slug: 'entrega',
    titulo: 'Entrega y pagos',
    icono: 'LuPackageCheck',
    video: '',
    resumen: 'Cómo te avisamos, cómo recoges tu equipo y qué pasa si cancelas.',
    contenido: [
      'Te avisamos por WhatsApp o correo electrónico cuando tu equipo esté listo.',
      'Revisa el equipo y sus accesorios al recibirlos, y cuéntanos de inmediato cualquier observación.',
      'Si otra persona recoge el equipo, podemos pedirle la orden de servicio, un documento de identificación o una autorización.',
      'Si hay valores pendientes de pago, podemos conservar el equipo hasta el pago total.',
      'Si cancelas una reparación que ya autorizaste, podemos cobrar el trabajo realizado y los repuestos usados o adquiridos, siempre que te los hayamos informado y los hayas autorizado. Cuando la ley obligue a devolver dinero, hacemos el reembolso en los términos que ella establezca.',
    ],
    puntosClave: [
      'Te avisamos cuando el equipo esté listo.',
      'Revisa tu equipo y sus accesorios al recibirlo.',
      'El equipo se entrega con el pago completo.',
    ],
    seccionRelacionada: 8,
  },
  {
    slug: 'equipos-no-reclamados',
    titulo: 'Equipos no reclamados',
    icono: 'LuArchive',
    video: '',
    resumen: 'Los plazos para recoger tu equipo y qué pasa si no lo haces.',
    contenido: [
      'Si pasa un mes desde la fecha prevista de entrega, o desde la fecha en que debías aceptar o rechazar el servicio, te enviamos un aviso para que recojas tu equipo.',
      'Desde ese aviso tienes dos meses más para recogerlo.',
      'Si no lo recoges en ese plazo, se aplica el procedimiento legal para bienes abandonados (Decreto 1413 de 2018), y los costos de almacenamiento que la ley permita pueden quedar a tu cargo.',
      'Recuerda: si no recoges el equipo en los 2 días siguientes al aviso de que está listo, la garantía empieza a contar desde ese aviso.',
    ],
    puntosClave: [
      'Al mes te enviamos un aviso para que recojas tu equipo.',
      'Desde el aviso tienes 2 meses más.',
      'Después se aplica el procedimiento legal para bienes abandonados.',
    ],
    seccionRelacionada: 8,
  },
  {
    slug: 'pqrs',
    ruta: '/pqrs', // este tema no usa la plantilla: su video y textos se muestran en la página PQRS
    titulo: 'PQRS',
    icono: 'LuMessageSquare',
    video: '',
    resumen: 'Cómo presentar una petición, queja, reclamo o solicitud de garantía.',
    contenido: [
      'Tu opinión es importante para nosotros: déjanos tu experiencia y te ayudamos a resolver. Queremos mejorar.',
    ],
    puntosClave: [
      'Primero acércate a la tienda.',
      'Si no hubo solución, radica tu PQRS en línea.',
      'Guarda tu número de radicado para hacer seguimiento.',
    ],
    seccionRelacionada: 10,
  },
];

export const rutaTema = (tema) => tema.ruta ?? `/condiciones/${tema.slug}`;
