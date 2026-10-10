import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowLeft, LuLogOut } from 'react-icons/lu';
import SEO from '../components/SEO';
import { Aviso, Marca } from '../components/admin/Elementos';
import Panel from '../components/admin/Panel';
import { adminApi, escribirAdmin } from '../utils/adminApi';
import '../styles/admin.css';

export default function AdminPage() {
  const [sesion, setSesion] = useState(undefined);
  const [mensaje, setMensaje] = useState('');
  const [intento, setIntento] = useState(0);
  const [saliendo, setSaliendo] = useState(false);
  const expirar = useCallback((error) => { setSesion(null); setMensaje(error.message); }, []);
  useEffect(() => {
    const controller = new AbortController();
    adminApi('/api/admin-sesion', { signal: controller.signal }).then(setSesion).catch((error) => {
      if (error.name === 'AbortError') return;
      setSesion(null);
      if (error.status !== 401) setMensaje(error.message);
    });
    return () => controller.abort();
  }, [intento]);

  const salir = async () => {
    setSaliendo(true);
    try { await escribirAdmin('/api/admin-sesion', 'DELETE'); setSesion(null); setMensaje(''); }
    catch (error) { setMensaje(error.message); }
    finally { setSaliendo(false); }
  };

  return (
    <div className="admin-app">
      <SEO title="Administración | GOTFIX" description="Panel privado de seguimiento de PQRS y aceptaciones de términos." path="/admin" robots="noindex, nofollow" schema={null} />
      <a className="admin-saltar" href="#admin-contenido">Ir al contenido</a>
      {sesion === undefined ? <main className="admin-login" id="admin-contenido"><Marca /><p role="status">Verificando tu sesión…</p></main> : !sesion ? (
        <Login mensaje={mensaje} onLogin={(datos) => { setSesion(datos); setMensaje(''); }} onReintentar={() => { setMensaje(''); setSesion(undefined); setIntento((v) => v + 1); }} />
      ) : <>
        <header className="admin-cabecera"><Marca /><div className="admin-cuenta"><span>{sesion.correo}</span><button className="admin-boton admin-boton-secundario" onClick={salir} disabled={saliendo}><LuLogOut aria-hidden="true" />{saliendo ? 'Saliendo…' : 'Cerrar sesión'}</button></div></header>
        <Panel onExpirar={expirar} mensajeSesion={mensaje} saliendo={saliendo} />
      </>}
    </div>
  );
}

function Login({ mensaje, onLogin, onReintentar }) {
  const titulo = useRef(null);
  useEffect(() => { titulo.current?.focus(); }, []);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const entrar = async (e) => {
    e.preventDefault(); setOcupado(true); setError('');
    try { onLogin(await escribirAdmin('/api/admin-sesion', 'POST', { correo, clave })); }
    catch (err) { setError(err.message); }
    finally { setOcupado(false); setClave(''); }
  };
  return (
    <main className="admin-login" id="admin-contenido"><Marca />
      <section className="admin-login-formulario" aria-labelledby="admin-login-titulo">
        <h1 ref={titulo} tabIndex={-1} id="admin-login-titulo">Administración</h1>
        <p className="admin-muted">Consulta solicitudes, registra su seguimiento y descarga las aceptaciones de términos.</p>
        <Aviso mensaje={mensaje} />
        {mensaje && <button className="admin-enlace" onClick={onReintentar}>Comprobar conexión y sesión</button>}
        <form onSubmit={entrar}>
          <label htmlFor="admin-correo">Correo electrónico</label><input id="admin-correo" type="email" autoComplete="username" value={correo} onChange={(e) => setCorreo(e.target.value)} maxLength={254} required disabled={ocupado} />
          <label htmlFor="admin-clave">Contraseña</label><input id="admin-clave" type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} maxLength={1024} required disabled={ocupado} />
          <Aviso mensaje={error} /><button className="admin-boton admin-boton-primario" disabled={ocupado}>{ocupado ? 'Ingresando…' : 'Entrar al panel'}</button>
        </form>
        <p className="admin-ayuda">Acceso exclusivo para la cuenta administradora de GOTFIX. Cuando tu sesión venza, vuelve a ingresar.</p>
        <Link className="admin-enlace admin-volver" to="/"><LuArrowLeft aria-hidden="true" />Volver al sitio</Link>
      </section>
    </main>
  );
}
