import { createHash } from 'node:crypto';
import { terminos } from '../../src/data/terminos.js';

// Huella SHA-256 del texto exacto de los términos: permite demostrar qué texto aceptó el cliente.
export const HASH_TERMINOS = createHash('sha256').update(JSON.stringify(terminos)).digest('hex');
