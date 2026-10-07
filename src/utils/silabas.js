import { hyphenateSync } from 'hyphen/es';

// Marca con guiones invisibles (soft hyphen) los puntos donde una palabra se puede partir en
// español. Así el texto justificado no deja huecos en celular, aunque el navegador no tenga
// diccionario propio. El texto visible no cambia: el guion solo aparece al partir una línea.
// Correos y direcciones web se dejan intactos.
const NO_PARTIR = /[@/]|www\.|\.\w{2,}$/;

export const silabear = (texto) =>
  texto
    .split(/(\s+)/)
    .map((trozo) => (NO_PARTIR.test(trozo) ? trozo : hyphenateSync(trozo)))
    .join('');
