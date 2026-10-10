import { useEffect, useRef, useState } from 'react';
import { LuArrowLeft, LuDownload } from 'react-icons/lu';
import { ESTADOS_PQRS } from '../../data/estadosPqrs';
import { adminApi, descargarAdmin, escribirAdmin } from '../../utils/adminApi';
import { fechaAdmin as fecha } from '../../utils/fechaAdmin';
import { Aviso, Estado } from './Elementos';

export default function Detalle({ id, onVolver, onExpirar, onGuardar }) {
  const titulo = useRef(null);
  const campoNota = useRef(null);
  const recargar = useRef(null);
  const enfocado = useRef(false);
  const restaurarFoco = useRef(false);
  const [datos, setDatos] = useState(null);
  const [estado, setEstado] = useState('');
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [descargando, setDescargando] = useState(null);
  const [revision, setRevision] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [conflicto, setConflicto] = useState(false);
  useEffect(() => {
    if (cargando || ocupado || !datos) return;
    if (restaurarFoco.current) {
      (conflicto ? recargar : campoNota).current?.focus();
      restaurarFoco.current = false;
    } else if (!enfocado.current) {
      titulo.current?.focus(); enfocado.current = true;
    }
  }, [cargando, ocupado, datos, conflicto]);
  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    adminApi(`/api/admin?${new URLSearchParams({ recurso: 'detalle', id })}`, { signal: controller.signal }).then((r) => {
      setDatos(r); setEstado(r.pqr.estado); setConflicto(false);
    }).catch((err) => {
      if (err.name === 'AbortError') return;
      if ([401, 403].includes(err.status)) onExpirar(err); else setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setCargando(false); });
    return () => controller.abort();
  }, [id, revision, onExpirar]);
  const guardar = async (e) => {
    restaurarFoco.current = true;
    e.preventDefault(); setOcupado(true); setError(''); setMensaje('');
    try {
      await escribirAdmin('/api/admin', 'PATCH', { id, estado, estadoAnterior: datos.pqr.estado, nota });
      setCargando(true); setNota(''); setMensaje('Seguimiento guardado.'); setRevision((v) => v + 1); onGuardar();
    } catch (err) {
      if ([401, 403].includes(err.status)) onExpirar(err);
      else { setError(err.message); setConflicto(err.status === 409); }
    } finally { setOcupado(false); }
  };
  const descargar = async (indice) => {
    setDescargando(indice); setError('');
    try { await descargarAdmin('adjunto', id, indice); }
    catch (err) { if ([401, 403].includes(err.status)) onExpirar(err); else setError(err.message); }
    finally { setDescargando(null); }
  };
  return <>
    <button className="admin-enlace admin-volver" onClick={onVolver} disabled={ocupado}><LuArrowLeft aria-hidden="true" />Volver a las PQRS</button>
    <Aviso mensaje={error} /><Aviso mensaje={mensaje} exito />
    {conflicto || (!datos && !cargando) ? <button ref={recargar} className="admin-boton admin-boton-secundario" onClick={() => { restaurarFoco.current = true; setError(''); setRevision((v) => v + 1); }}>Actualizar detalle</button> : null}
    {cargando ? <div className="admin-cargando" role="status"><span className="admin-sr">Cargando caso…</span><div /><div /><div /></div> : datos && <>
      <div className="admin-titulo"><div><h1 ref={titulo} tabIndex={-1}>{datos.pqr.radicado}</h1><p className="admin-muted">Radicado el {fecha(datos.pqr.creado_en)}</p></div><Estado valor={datos.pqr.estado} /></div>
      <div className="admin-detalle">
        <section aria-labelledby="admin-solicitud"><h2 id="admin-solicitud">Solicitud del cliente</h2><dl className="admin-datos"><div><dt>Nombre</dt><dd>{datos.pqr.nombre}</dd></div><div><dt>Documento</dt><dd>{datos.pqr.documento}</dd></div><div><dt>Correo</dt><dd>{datos.pqr.correo}</dd></div><div><dt>WhatsApp</dt><dd>{datos.pqr.whatsapp}</dd></div><div><dt>Orden</dt><dd>{datos.pqr.orden || 'Sin orden'}</dd></div><div><dt>Visitó la tienda</dt><dd>{datos.pqr.paso_por_tienda ? 'Sí' : 'No'}</dd></div></dl><h3>Descripción</h3><p className="admin-descripcion">{datos.pqr.descripcion}</p><h3>Adjuntos</h3>{datos.pqr.adjuntos.length ? <ul className="admin-adjuntos">{datos.pqr.adjuntos.map((a, i) => <li key={a.ruta}><span>{a.nombre}</span><button className="admin-enlace" onClick={() => descargar(i)} disabled={descargando !== null} aria-label={`Descargar ${a.nombre}`}><LuDownload aria-hidden="true" />{descargando === i ? 'Descargando…' : 'Descargar'}</button></li>)}</ul> : <p className="admin-muted">El cliente no adjuntó archivos.</p>}</section>
        <section className="admin-seguimiento" aria-labelledby="admin-seguimiento"><h2 id="admin-seguimiento">Registrar seguimiento</h2><form onSubmit={guardar}><label htmlFor="admin-nuevo-estado">Estado del PQR</label><select id="admin-nuevo-estado" value={estado} onChange={(e) => setEstado(e.target.value)} disabled={ocupado || conflicto}>{Object.entries(ESTADOS_PQRS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select><label htmlFor="admin-nota">Nota de seguimiento <span className="admin-muted">(opcional al cambiar el estado)</span></label><textarea ref={campoNota} id="admin-nota" rows={5} maxLength={2000} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Registra la gestión realizada o la respuesta al cliente." disabled={ocupado || conflicto} aria-describedby="admin-nota-ayuda" /><p id="admin-nota-ayuda" className="admin-ayuda">La nota es interna. Guardar el seguimiento no envía un correo al cliente. Puedes agregar una nota sin cambiar el estado.</p><button className="admin-boton admin-boton-primario" disabled={ocupado || conflicto || (estado === datos.pqr.estado && !nota.trim())}>{ocupado ? 'Guardando…' : 'Guardar seguimiento'}</button></form></section>
      </div>
      <section className="admin-historial" aria-labelledby="admin-historial"><h2 id="admin-historial">Historial de seguimiento</h2><p className="admin-muted">Última actualización: {fecha(datos.pqr.actualizado_en)}</p>{datos.historial.length ? <ol>{datos.historial.map((h) => <li key={h.id}><div className="admin-historial-cabecera"><strong>{h.estado_anterior === h.estado_nuevo ? `Nota · ${ESTADOS_PQRS[h.estado_nuevo]}` : `${ESTADOS_PQRS[h.estado_anterior]} → ${ESTADOS_PQRS[h.estado_nuevo]}`}</strong><time dateTime={h.creado_en}>{fecha(h.creado_en)}</time></div>{h.nota && <p className="admin-descripcion">{h.nota}</p>}<span className="admin-ayuda">Registrado por {h.admin_correo}</span></li>)}</ol> : <p className="admin-muted">Aún no hay gestiones registradas. El próximo seguimiento aparecerá aquí.</p>}</section>
    </>}
  </>;
}
