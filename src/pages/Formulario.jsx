import { Navigate } from 'react-router-dom';

// El formulario de firma vive al final de /condiciones. Esta ruta (botón "Formulario" del menú)
// abre esa misma página directamente en la sección de firma.
export default function Formulario() {
  return <Navigate to="/condiciones#firmar" replace />;
}
