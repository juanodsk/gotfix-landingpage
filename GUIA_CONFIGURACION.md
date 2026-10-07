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

- **Ver firmas:** Supabase → Table Editor → `aceptaciones_terminos`. El PDF y la imagen de
  cada firma están en Storage → `firmas` → año → identificador.
- **Ver y gestionar PQRS:** Supabase → Table Editor → `pqrs`. Cambia la columna `estado`
  a `en_tramite`, `respondido` o `cerrado` a medida que avances.
- **Adjuntos de PQRS:** Storage → `pqrs-adjuntos`. Los enlaces del correo de aviso vencen
  en 7 días; después, descárgalos desde aquí.

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| "No pudimos procesar tu solicitud" | Falta alguna variable en Vercel o no hiciste *Redeploy*. |
| La firma se guarda pero dice que no pudo enviar la copia | El dominio aún no está verificado en Resend, o `RESEND_FROM` no usa `@gotfix.co`. |
| Los correos llegan a spam | Normal los primeros días; termina de verificar el dominio en Resend. |
| Error al subir fotos de la PQRS | Revisa que el bucket `pqrs-adjuntos` exista (vuelve a ejecutar `schema.sql`). |

Para ver el detalle técnico de un error: Vercel → proyecto → **Logs**.
