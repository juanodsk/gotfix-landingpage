# Guía de configuración — Centro de Condiciones GOTFIX

Esta guía es para alguien que **no es programador**. Al terminarla, las firmas y las PQRS
quedarán guardadas en una base de datos privada y los correos llegarán solos.

Necesitas unos 40 minutos, acceso al correo de GOTFIX y acceso al lugar donde se compró el
dominio **gotfix.co** (por ejemplo GoDaddy, Hostinger o Namecheap).

Vas a crear dos cuentas gratuitas:

| Servicio | Para qué sirve |
|---|---|
| **Supabase** | Guarda las firmas, las PQRS y los archivos adjuntos (base de datos privada). |
| **Resend** | Envía los correos (copia en PDF al cliente y avisos a gotfixco@gmail.com). |

Al final copiarás 5 datos en **Vercel**, donde está publicado el sitio.

> 🔒 Las claves que vas a copiar son como las llaves de la tienda. No las envíes por WhatsApp
> ni las pegues en el código; solo van en Vercel.

---

## Parte 1 — Supabase (base de datos)

1. Entra a **https://supabase.com** y haz clic en **Start your project**. Regístrate con el
   correo de GOTFIX.
2. Haz clic en **New project** y llena:
   - **Name:** `gotfix`
   - **Database Password:** haz clic en *Generate a password* y **guárdala** en un lugar seguro.
   - **Region:** elige **East US (North Virginia)** o **South America (São Paulo)**.
   - Clic en **Create new project** y espera 1 o 2 minutos.
3. Crear las tablas:
   - En el menú de la izquierda entra a **SQL Editor** → **New query**.
   - Abre el archivo `supabase/schema.sql` (está en esta carpeta), copia **todo** su contenido
     y pégalo en el editor.
   - Haz clic en **Run**. Debe aparecer *Success. No rows returned*.
4. Comprueba que quedó bien:
   - En **Table Editor** deben aparecer las tablas `aceptaciones_terminos`, `pqrs` y `pqrs_consecutivos`.
   - En **Storage** deben aparecer los buckets `firmas` y `pqrs-adjuntos`, ambos **sin** la
     etiqueta *Public*.
5. Copia las dos claves (déjalas en una nota temporal):
   - Ve a **Project Settings** (ícono de engranaje) → **Data API**. Copia la **Project URL**
     (se ve así: `https://abcdxyz.supabase.co`). → será `SUPABASE_URL`.
   - Ve a **Project Settings** → **API Keys**. Crea o revela una **Secret key** (empieza por
     `sb_secret_`). → será `SUPABASE_SECRET_KEY`. Si tu proyecto antiguo solo muestra
     `service_role`, también funciona, pero Supabase recomienda migrar a Secret keys.

> ⚠️ La Secret key da acceso elevado y omite las políticas RLS. Solo va en Vercel; nunca se
> pega en el frontend, en Git, en WhatsApp ni en una URL.

## Parte 2 — Resend (correos)

1. Entra a **https://resend.com** y crea una cuenta con el correo de GOTFIX.
2. **Verificar el dominio** (sin esto, los correos solo llegan a tu propio correo y no a los clientes):
   - En el menú entra a **Domains** → **Add Domain**. Escribe `gotfix.co` y elige la región
     **North Virginia (us-east-1)**.
   - Resend te mostrará 3 o 4 registros DNS (tipo **MX** y **TXT**). Déjalos abiertos.
   - En otra pestaña, entra a la cuenta donde compraste el dominio, busca **DNS** o
     **Administrar DNS** y agrega cada registro **exactamente** como aparece en Resend
     (tipo, nombre y valor).
   - Vuelve a Resend y haz clic en **Verify DNS Records**. Puede tardar desde unos minutos
     hasta unas horas. Cuando diga **Verified** ✅, sigue.
   - Si el dominio está conectado a Vercel (los DNS los administra Vercel), agrega los
     registros en **Vercel → Domains → gotfix.co → DNS Records**.
3. Crear la clave: entra a **API Keys** → **Create API Key** → nombre `gotfix-web`,
   permiso **Sending access** → **Add**. Copia la clave (empieza por `re_`). Solo se muestra
   una vez. → será `RESEND_API_KEY`.

## Parte 3 — Cargar las variables en Vercel

1. Entra a **https://vercel.com**, abre el proyecto del sitio de GOTFIX y ve a
   **Settings → Environment Variables**.
2. Agrega estas 5 variables. Para cada una escribe el nombre (**Key**) y el valor (**Value**),
   marca **Production**, **Preview** y **Development**, y haz clic en **Save**.

| Key | Value |
|---|---|
| `SUPABASE_URL` | La Project URL de Supabase |
| `SUPABASE_SECRET_KEY` | La Secret key de Supabase (`sb_secret_...`) |
| `RESEND_API_KEY` | La clave `re_...` de Resend |
| `RESEND_FROM` | `GOTFIX <notificaciones@gotfix.co>` |
| `CORREO_GOTFIX` | `gotfixco@gmail.com` |

3. Para que el sitio tome los cambios: ve a **Deployments**, abre el menú `⋯` del despliegue
   más reciente y elige **Redeploy**.

## Parte 4 — Prueba final (5 minutos)

1. Abre **www.gotfix.co/formulario** desde el celular, llena tus datos con tu propio correo y firma.
   - Debe aparecer *"Listo, te enviamos una copia a tu correo"*.
   - Te debe llegar un correo con el PDF, y una copia a gotfixco@gmail.com.
   - En Supabase → **Table Editor → aceptaciones_terminos** debe aparecer la fila.
2. Abre **www.gotfix.co/pqrs**, radica un caso de prueba con una foto.
   - Debe mostrarse un número como **PQRS-2026-0001**.
   - Deben llegar dos correos: la confirmación al cliente y el aviso a gotfixco@gmail.com
     con el enlace a la foto.
3. Borra las filas de prueba en Supabase (Table Editor → selecciona la fila → *Delete*).
   Si quieres que el consecutivo vuelva a empezar en 0001, en la tabla `pqrs_consecutivos`
   borra también la fila del año.

## Uso diario

Primero activa el panel siguiendo la sección siguiente. Luego entra a **https://gotfix.co/admin**
con tu correo y contraseña.

- **PQRS:** busca por nombre, documento, correo, WhatsApp, orden o radicado. Filtra por
  **Radicado**, **En trámite**, **Respondido** o **Cerrado**. Cada página muestra hasta 25 registros.
- **Ver caso:** muestra los datos del cliente, la descripción y los adjuntos. En
  **Registrar seguimiento**, selecciona el estado, agrega una nota y pulsa **Guardar seguimiento**.
  Puedes registrar notas sin cambiar el estado. Las notas son internas; no se envían al cliente.
  El historial conserva la fecha, el administrador y el cambio realizado. Si el estado cambió
  mientras lo tenías abierto, pulsa **Actualizar detalle** antes de guardar.
- **Términos aceptados:** busca personas por nombre, documento, correo, WhatsApp, orden o equipo.
  Pulsa **Descargar PDF** para obtener el archivo original que se generó al aceptar.
  Se conservan las aceptaciones existentes; no se regeneran sus PDF con términos nuevos.
- **Cerrar sesión:** al terminar, pulsa este botón. La sesión vence como máximo en una hora
  (o antes si así está configurado Supabase Auth); vuelve a ingresar cuando lo solicite el panel.

## Activar el panel administrativo

### 1. Actualizar la base de datos

Si ya guardas firmas y PQRS, **no necesitas borrar las tablas**. En Supabase → SQL Editor
ejecuta el contenido de **`supabase/migrations/20261010_admin_pqrs.sql`**.
En un proyecto nuevo, ejecuta primero **`supabase/schema.sql`** y después esa migración.

Comprueba que `pqrs.estado` tenga tipo **estado_pqr**, que exista `pqrs.actualizado_en`
y que aparezca la tabla **pqrs_seguimiento**. Los cuatro estados existentes se conservan.
Los casos previos no tienen historial de cambios anteriores; el historial comienza con las
gestiones registradas desde el panel.

### 2. Crear tu usuario

En Supabase → **Authentication → Users → Add user → Create new user**:

- Escribe el correo que usarás para administrar y una contraseña segura.
- Crea el usuario con el correo confirmado (**Auto Confirm User**, si se muestra esa opción).
- En la configuración de Authentication, desactiva los registros públicos si no los necesitas.
  Los formularios públicos de GOTFIX no crean cuentas, así que seguirán funcionando.

Solo el correo que configures en `ADMIN_EMAIL` podrá entrar. Una cuenta de Supabase diferente
no obtiene acceso al panel aunque tenga una contraseña válida.

### 3. Agregar dos variables en Vercel

Conserva las variables anteriores y agrega:

| Key | Value |
|---|---|
| `SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys → Publishable key (`sb_publishable_...`); para proyectos antiguos también se admite `SUPABASE_ANON_KEY` |
| `ADMIN_EMAIL` | El correo exacto del usuario administrador que acabas de crear |

Estas variables se usan en las funciones del servidor. No les agregues el prefijo `VITE_`.
La contraseña se guarda en Supabase Auth, **no en el código ni en una variable de Vercel**.
Haz **Redeploy** para publicar el código actualizado con las variables nuevas.

### 4. Comprobar el panel

1. Entra a `/admin`. Sin sesión, debe aparecer el formulario de login.
2. Inicia sesión y comprueba que aparezcan tus PQRS existentes.
3. Abre un caso de prueba, cambia su estado y agrega una nota. Recarga y comprueba que el
   estado y la nota sigan guardados. En Supabase aparecerá también la fila de seguimiento.
4. En **Términos aceptados**, busca una aceptación anterior y descarga su PDF. Verifica
   los datos y la versión del documento. Si no existe el archivo porque su generación falló,
   el panel te lo indicará; la aceptación sigue conservada.
5. Cierra sesión y comprueba que ya no puedas consultar los registros.

### Pruebas locales para desarrollo

- `npm test`: prueba los endpoints con respuestas simuladas de Supabase y ejecuta el SQL real
  en PostgreSQL local mediante PGlite, sin conectarse a la base de datos de producción.
- `npm run lint` y `npm run build`: comprueban código y compilación.
- `npm run dev` sirve la interfaz con Vite. Para probar login, datos y descargas reales,
  usa `vercel dev` con las variables de entorno locales o un despliegue Preview configurado.
  Vite por sí solo no ejecuta las funciones `/api`.

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| "No pudimos procesar tu solicitud" | Falta alguna variable en Vercel o no hiciste *Redeploy*. |
| La firma se guarda pero dice que no pudo enviar la copia | El dominio aún no está verificado en Resend, o `RESEND_FROM` no usa `@gotfix.co`. |
| Los correos llegan a spam | Normal los primeros días; termina de verificar el dominio en Resend. |
| Error al subir fotos de la PQRS | Revisa que el bucket `pqrs-adjuntos` exista (vuelve a ejecutar `schema.sql`). |

Para ver el detalle técnico de un error: Vercel → proyecto → **Logs**.
