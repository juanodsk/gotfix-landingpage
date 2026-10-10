# GOTFIX: administración

Registro de superficie revisada el 10 de octubre de 2026. Alcance: `/admin`, en modo **Operate**, como extensión funcional de GOTFIX. Este documento describe la implementación actual; no establece una identidad nueva ni un sistema visual global.

## Overview

El administrador consulta PQRS, registra su seguimiento, busca aceptaciones de términos y descarga sus PDF. La entrada usa correo y contraseña, con verificación de sesión y cierre de sesión. La navegación tiene dos opciones: **PQRS** y **Términos aceptados**.

Autoridad de producto: `PRODUCT.md`. Autoridad visual incumbente: `src/components/condiciones/Banner.jsx`, `src/components/forms/Campo.jsx`, `src/index.css` y `src/assets/Logo.png`. Las acciones amarillas y los enlaces azules también tienen precedentes en `src/components/condiciones/FormularioFirma.jsx` y `src/components/condiciones/CtaDudas.jsx`.

Implementación de esta superficie: `src/pages/adminPage.jsx`, `src/components/admin/Panel.jsx`, `src/components/admin/Detalle.jsx`, `src/components/admin/Elementos.jsx` y `src/styles/admin.css`. Los estilos y tokens administrativos quedan delimitados por `.admin-app` y nombres `admin-`; la ruta carga el panel mediante importación diferida.

## Colors

| Valor observado | Uso en administración | Alineación |
| --- | --- | --- |
| Navy `#00162b` | Texto principal, cabecera, soporte del logo y navegación activa | Conserva el navy del banner público y los campos GOTFIX |
| Amarillo `#fcbc18` | Entrar, buscar y guardar seguimiento | Conserva el acento de las acciones públicas |
| Azul `#0067b8` | Enlaces de retorno, caso y descarga; indicador de foco | Conserva el color de enlaces y acciones secundarias públicas |
| Blanco `#fff` | Formularios, listados y estado vacío | Superficie de lectura |
| Fondo `#f4f7fa`, línea `#d6dfe7`, texto secundario `#526373` | Fondo operativo, separadores y metadatos | Valores locales del panel |

El logo se importa directamente de `src/assets/Logo.png`; no se reconstruye con texto. Está colocado sobre navy tanto en login como en la cabecera autenticada. Los estados usan fondos suaves y etiquetas textuales; el color no es su único identificador.

## Typography

La administración usa `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`, con cuerpo de 14 px, interlineado 1.5 y cifras tabulares. La excepción es local a `.admin-app`; `src/index.css` conserva Karst para el sitio público.

La jerarquía observada usa título de 28 px en escritorio y 24 px en móvil, secciones de 18 px y etiquetas de 13 px. Los campos heredan la fuente administrativa. Esta densidad pertenece al panel y no redefine los campos públicos de `Campo.jsx`, que mantienen su tamaño de 16 px.

## Layout

Login en contenedor de hasta 440 px. Tras iniciar sesión, cabecera con marca y salida; navegación lateral de 224 px y contenido de hasta 1440 px. A 1050 px, la navegación pasa a 190 px y el detalle ocupa una sola columna. A 720 px, la navegación se vuelve horizontal y el contenido usa márgenes interiores de 16 px.

Los listados muestran una tabla de cinco columnas en escritorio. En móvil se apilan las celdas dentro de cada fila, con etiquetas visibles mediante `data-label`. La tabla conserva caption, encabezados, asociaciones `headers` y roles explícitos. La paginación se coloca bajo el listado y comunica hasta 25 registros por página.

El detalle presenta solicitud y formulario de seguimiento en dos columnas cuando hay espacio. El historial aparece debajo; en móvil se conserva el mismo orden de lectura. Correos, descripción y nombres de archivos admiten saltos de línea.

## Elevation & Depth

El panel distingue superficies con fondos y bordes, sin sombras. La cabecera y la navegación activa usan navy; los formularios y listados usan blanco. Las transiciones de fondo duran 0.15 s y se desactivan con la preferencia de movimiento reducido.

## Shapes

Controles y botones con esquinas de 6 px, contenedores operativos de 8 px, login de 12 px e indicadores de estado de 4 px. Los botones y enlaces de acción tienen altura mínima de 44 px. El foco visible se representa con contorno azul de 3 px y separación de 3 px.

## Components

- **Login:** etiquetas persistentes, autocompletado de credenciales, aviso de error y estado de ingreso. El título recibe foco al entrar a la pantalla.
- **Navegación:** dos destinos con icono y texto; el activo usa navy y `aria-current`. El logo y el enlace de login permiten volver al sitio público.
- **Listados:** búsqueda explícita, filtro de estado solo en PQRS, actualización, contador, paginación, carga, error recuperable y estado vacío. Los resultados sin coincidencias explican cómo cambiar o limpiar los filtros.
- **Estados PQRS:** contrato compartido en `src/data/estadosPqrs.js`: `radicado` → Radicado, `en_tramite` → En trámite, `respondido` → Respondido y `cerrado` → Cerrado. Las flechas de esta lista expresan la traducción de valor a etiqueta, no restricciones de transición.
- **Seguimiento:** selector de estado y nota interna; permite agregar una nota sin cambiar el estado. La ayuda aclara que guardar no envía correo al cliente. El historial muestra cambio o nota, fecha y administrador. Un conflicto ofrece actualizar el detalle. Tras guardar se restaura el foco en la nota.
- **Descargas:** acciones rotuladas para adjuntos y PDF de aceptaciones, con indicación de descarga y recuperación de error.
- **Avisos:** errores con `role="alert"`, éxitos y cargas con `role="status"`. Hay enlace para saltar al contenido.

## Do's and Don'ts

- Conservar en esta superficie el logo existente, navy, amarillo y azul de enlace GOTFIX.
- Mantener la fuente administrativa y los estilos limitados al panel; el sitio público conserva su autoridad visual.
- Conservar etiquetas textuales de estado y estructura accesible al apilar los listados.
- No extrapolar la densidad, composición, colores auxiliares ni radios del admin al sistema global.

## Evidencia y límites

Se revisaron visualmente las diez capturas finales de `.impeccable/review/`: `login`, `pqrs`, `detalle`, `aceptaciones` y `vacio`, cada una en `desktop` y `mobile`. Las capturas corresponden a escritorio de 1440 × 1000 y móvil de 390 × 844; cuando hay desplazamiento vertical, la barra de Windows reduce 15 px el ancho útil. Se observan marca sobre navy, acciones amarillas, enlaces azules, tabla de escritorio, filas móviles y seguimiento con historial. Los contornos en los títulos del login y en la nota corresponden al foco programático.

La comprobación de los archivos compilados `dist/assets/adminPage-*.css` e `index-*.css` confirma los tres colores administrativos, la fuente de sistema local y la permanencia de Karst en el CSS principal. El diff de los tres archivos incumbentes citados no contiene cambios en esta revisión.

Resultados comunicados por la ejecución principal de esta tarea, sin repetir las pruebas durante la documentación:

- `npm run lint`, `npm test` (22/22) y `npm run build` pasaron. El build conserva una advertencia de tamaño del bundle principal de aproximadamente 603 kB.
- El detector aplicado una vez a página, componentes y CSS administrativos devolvió `[]`.
- `tests/browser-admin-setup.cjs` y `tests/browser-admin-flow.cjs` pasaron con API y datos simulados: login correcto e incorrecto, filtros y búsqueda vacía, cambio de estado y nota, recarga, conflicto 409, descargas, búsqueda por documento y salida. También comprobaron foco en navegación y guardado, cinco encabezados de columna en móvil y `scrollWidth <= clientWidth`.
- La revisión final marcó como resueltos los cuatro hallazgos previos sobre logo, contraste, foco y tabla accesible. Su dictamen Pass / ship se limita a esas correcciones.

Deriva previa observada al comparar el admin de `HEAD`: usaba acciones genéricas azules, verdes y rojas y no mostraba el logo GOTFIX. Ese antecedente no constituye autoridad visual global; la implementación revisada usa la identidad incumbente. Esta pasada de documentación no repara código ni cambia archivos previos.

Estas evidencias acreditan el comportamiento local y simulado. La cuenta administradora y la migración de producción requieren configuración externa; Supabase y Vercel reales no están verificados ni activados por esta revisión. No se crea `DESIGN.md` global ni `.impeccable/design.json`; el único resultado documental de esta pasada es este registro de superficie.
