import {
  LuArchive,
  LuClipboardCheck,
  LuMessageSquare,
  LuPackageCheck,
  LuScanSearch,
  LuShieldCheck,
  LuSmartphone,
  LuWrench,
} from 'react-icons/lu';

// Íconos lineales disponibles para el campo "icono" de temas.js.
const iconos = {
  LuArchive,
  LuClipboardCheck,
  LuMessageSquare,
  LuPackageCheck,
  LuScanSearch,
  LuShieldCheck,
  LuSmartphone,
  LuWrench,
};

export default function IconoTema({ nombre, className }) {
  const Icono = iconos[nombre] ?? LuClipboardCheck;
  return <Icono className={className} aria-hidden="true" />;
}
