import { useEffect, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuClipboardList, LuDownload, LuFileCheck, LuRefreshCw, LuSearch } from 'react-icons/lu';
import { ESTADOS_PQRS } from '../../data/estadosPqrs';
import { adminApi, descargarAdmin } from '../../utils/adminApi';
import { fechaAdmin as fecha } from '../../utils/fechaAdmin';
import { Aviso, Estado } from './Elementos';
import Detalle from './Detalle';

const PESTANAS_ESTADO = [['', 'TODOS'], ...Object.entries(ESTADOS_PQRS)];

export default function Panel({ onExpirar, mensajeSesion, saliendo }) {
  const titulo = useRef(null);
  const pestanas = useRef([]);
  const [seccion, setSeccion] = useState('pqrs');
  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [caso, setCaso] = useState(null);
  const [descargando, setDescargando] = useState('');
  const esPqrs = seccion === 'pqrs';
  useEffect(() => { if (!caso) titulo.current?.focus(); }, [seccion, caso]);
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ recurso: seccion, buscar, estado: esPqrs ? estado : '', pagina });
    setCargando(true); setError(''); setDatos(null);
    adminApi(`/api/admin?${params}`, { signal: controller.signal }).then(setDatos).catch((err) => {
      if (err.name === 'AbortError') return;
      if ([401, 403].includes(err.status)) onExpirar(err); else setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setCargando(false); });
    return () => controller.abort();
  }, [seccion, buscar, estado, pagina, revision, esPqrs, onExpirar]);

  const cambiarSeccion = (valor) => { setSeccion(valor); setPagina(1); setBuscar(''); setTexto(''); setEstado(''); setCaso(null); setError(''); };
  const cambiarEstado = (valor) => { setEstado(valor); setPagina(1); };
  const navegarPestanas = (event, indice) => {
    let siguiente;
    if (event.key === 'ArrowRight') siguiente = (indice + 1) % PESTANAS_ESTADO.length;
    else if (event.key === 'ArrowLeft') siguiente = (indice - 1 + PESTANAS_ESTADO.length) % PESTANAS_ESTADO.length;
    else if (event.key === 'Home') siguiente = 0;
    else if (event.key === 'End') siguiente = PESTANAS_ESTADO.length - 1;
    else return;
    event.preventDefault();
    cambiarEstado(PESTANAS_ESTADO[siguiente][0]);
    pestanas.current[siguiente]?.focus();
  };
  const descargar = async (id) => {
    setDescargando(id); setError('');
    try { await descargarAdmin('pdf', id); }
    catch (err) { if ([401, 403].includes(err.status)) onExpirar(err); else setError(err.message); }
    finally { setDescargando(''); }
  };
  const totalPaginas = Math.max(1, Math.ceil((datos?.total || 0) / (datos?.limite || 25)));
  return (
    <div className="admin-layout">
      <aside className="admin-lateral"><nav aria-label="Administración"><button className={esPqrs ? 'admin-nav-activo' : ''} aria-current={esPqrs ? 'page' : undefined} onClick={() => cambiarSeccion('pqrs')}><LuClipboardList aria-hidden="true" />PQRS</button><button className={!esPqrs ? 'admin-nav-activo' : ''} aria-current={!esPqrs ? 'page' : undefined} onClick={() => cambiarSeccion('aceptaciones')}><LuFileCheck aria-hidden="true" />Términos aceptados</button></nav><p>Seguimiento de clientes<br />GOTFIX</p></aside>
      <main className="admin-contenido" id="admin-contenido"><Aviso mensaje={mensajeSesion} />
        {caso ? <Detalle key={caso} id={caso} onVolver={() => setCaso(null)} onExpirar={onExpirar} onGuardar={() => setRevision((v) => v + 1)} /> : <>
          <div className="admin-titulo"><div><h1 ref={titulo} tabIndex={-1}>{esPqrs ? 'PQRS' : 'Términos aceptados'}</h1><p className="admin-muted">{esPqrs ? 'Revisa cada solicitud y registra los avances de su atención.' : 'Busca las personas que aceptaron los términos y descarga su documento firmado.'}</p></div><button className="admin-boton admin-boton-secundario" disabled={cargando || saliendo} onClick={() => setRevision((v) => v + 1)}><LuRefreshCw aria-hidden="true" />Actualizar</button></div>
          {esPqrs && <div className="admin-pestanas-estado" role="tablist" aria-label="Estado del PQR">
            {PESTANAS_ESTADO.map(([valor, etiqueta], indice) => <button key={valor} ref={(elemento) => { pestanas.current[indice] = elemento; }} type="button" role="tab" id={`admin-pestana-${valor || 'todos'}`} aria-controls="admin-listado" aria-selected={estado === valor} tabIndex={estado === valor ? 0 : -1} disabled={saliendo} onClick={() => cambiarEstado(valor)} onKeyDown={(event) => navegarPestanas(event, indice)}>{etiqueta}</button>)}
          </div>}
          <section id="admin-listado" role={esPqrs ? 'tabpanel' : undefined} aria-labelledby={esPqrs ? `admin-pestana-${estado || 'todos'}` : undefined}>
          <form className="admin-filtros" onSubmit={(e) => { e.preventDefault(); setPagina(1); setBuscar(texto.trim()); setRevision((v) => v + 1); }}>
            <div className="admin-busqueda"><label htmlFor="admin-buscar">Buscar {esPqrs ? 'solicitud' : 'aceptación'}</label><div><LuSearch aria-hidden="true" /><input id="admin-buscar" type="search" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={100} placeholder={esPqrs ? 'Nombre, documento, correo, orden o radicado' : 'Nombre, documento, correo, orden o equipo'} /></div></div>
            <button className="admin-boton admin-boton-primario" disabled={saliendo}>Buscar</button>
            {(buscar || estado || texto) && <button type="button" className="admin-enlace" onClick={() => { setTexto(''); setBuscar(''); setEstado(''); setPagina(1); }}>Limpiar</button>}
          </form>
          <Aviso mensaje={error} />{error && !datos && <button className="admin-boton admin-boton-secundario" onClick={() => setRevision((v) => v + 1)}>Volver a cargar</button>}
          {cargando ? <div className="admin-cargando" role="status"><span className="admin-sr">Cargando registros…</span>{[1, 2, 3, 4].map((i) => <div key={i} />)}</div> : datos && <>
            <p className="admin-resultados" role="status">{datos.total.toLocaleString('es-CO')} {datos.total === 1 ? 'registro' : 'registros'}{buscar || estado ? datos.total === 1 ? ' encontrado' : ' encontrados' : ' en total'}</p>
            {!datos.registros.length ? <section className="admin-vacio"><h2>{buscar || estado ? 'No hay resultados con estos filtros' : esPqrs ? 'Aún no hay PQRS radicadas' : 'Aún no hay aceptaciones'}</h2><p>{buscar || estado ? 'Prueba con otro nombre, documento o estado, o limpia la búsqueda.' : esPqrs ? 'Las solicitudes enviadas desde el formulario de PQRS aparecerán aquí.' : 'Las personas que firmen el formulario de términos aparecerán aquí con su PDF.'}</p></section> : (
              <div className="admin-tabla-contenedor"><table className="admin-tabla" role="table"><caption className="admin-sr">{esPqrs ? 'Solicitudes PQRS' : 'Aceptaciones de términos'}, página {pagina}</caption><thead role="rowgroup"><tr role="row"><th role="columnheader" id="admin-col-persona" scope="col">{esPqrs ? 'Radicado / Fecha' : 'Persona / Fecha'}</th><th role="columnheader" id="admin-col-contacto" scope="col">{esPqrs ? 'Cliente' : 'Contacto'}</th><th role="columnheader" id="admin-col-orden" scope="col">{esPqrs ? 'Orden' : 'Equipo / Orden'}</th><th role="columnheader" id="admin-col-estado" scope="col">{esPqrs ? 'Estado del PQR' : 'Versión'}</th><th role="columnheader" id="admin-col-accion" scope="col">{esPqrs ? 'Seguimiento' : 'Documento'}</th></tr></thead><tbody role="rowgroup">{datos.registros.map((r) => <tr key={r.id} role="row">
                <td role="cell" headers="admin-col-persona" data-label={esPqrs ? 'Radicado / Fecha' : 'Persona / Fecha'}><strong>{esPqrs ? r.radicado : r.nombre}</strong><span>{!esPqrs && <>Documento: {r.documento}<br /></>}{fecha(r.creado_en)}</span></td>
                <td role="cell" headers="admin-col-contacto" data-label={esPqrs ? 'Cliente' : 'Contacto'}>{esPqrs && <strong>{r.nombre}</strong>}<span>{esPqrs ? `Documento: ${r.documento}` : r.correo}</span><span>{esPqrs ? r.correo : r.whatsapp}</span></td>
                <td role="cell" headers="admin-col-orden" data-label={esPqrs ? 'Orden' : 'Equipo / Orden'}>{!esPqrs && <strong>{r.equipo}</strong>}<span>{r.orden || 'Sin orden'}</span></td>
                <td role="cell" headers="admin-col-estado" data-label={esPqrs ? 'Estado del PQR' : 'Versión'}>{esPqrs ? <Estado valor={r.estado} /> : r.version_terminos}</td>
                <td role="cell" headers="admin-col-accion" data-label={esPqrs ? 'Seguimiento' : 'Documento'}>{esPqrs ? <button className="admin-enlace" onClick={() => setCaso(r.id)} aria-label={`Ver caso ${r.radicado}`}>Ver caso <LuChevronRight aria-hidden="true" /></button> : <button className="admin-enlace" onClick={() => descargar(r.id)} disabled={Boolean(descargando)} aria-label={`Descargar PDF de ${r.nombre}`}><LuDownload aria-hidden="true" />{descargando === r.id ? 'Descargando…' : 'Descargar PDF'}</button>}</td>
              </tr>)}</tbody></table></div>
            )}
            <div className="admin-paginacion"><span>Página {pagina} de {totalPaginas} · Hasta 25 por página</span><div><button className="admin-boton admin-boton-secundario" disabled={pagina <= 1} onClick={() => setPagina((v) => v - 1)}><LuChevronLeft aria-hidden="true" />Anterior</button><button className="admin-boton admin-boton-secundario" disabled={pagina >= totalPaginas} onClick={() => setPagina((v) => v + 1)}>Siguiente<LuChevronRight aria-hidden="true" /></button></div></div>
          </>}
          </section>
        </>}
      </main>
    </div>
  );
}
