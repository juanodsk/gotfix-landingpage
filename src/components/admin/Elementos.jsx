import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import { ESTADOS_PQRS } from '../../data/estadosPqrs';

export function Marca() {
  return <Link to="/" aria-label="GOTFIX, ir al sitio web"><img className="admin-logo" src={logo} alt="GOTFIX" /></Link>;
}

export function Aviso({ mensaje, exito = false }) {
  return mensaje && <p className={`admin-aviso${exito ? ' admin-exito' : ''}`} role={exito ? 'status' : 'alert'}>{mensaje}</p>;
}

export function Estado({ valor }) {
  return <span className={`admin-estado admin-estado-${valor}`}>{ESTADOS_PQRS[valor] || valor}</span>;
}
