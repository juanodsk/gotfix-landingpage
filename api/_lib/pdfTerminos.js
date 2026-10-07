// Genera el PDF de constancia: Términos y Condiciones completos + datos del cliente + firma.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { terminos } from '../../src/data/terminos.js';

const ANCHO = 595.28; // A4
const ALTO = 841.89;
const MARGEN = 56;
const ANCHO_TEXTO = ANCHO - MARGEN * 2;
const AZUL = rgb(0, 135 / 255, 250 / 255);
const MARINO = rgb(0, 22 / 255, 43 / 255);
const GRIS = rgb(0.38, 0.42, 0.47);
const TEXTO = rgb(0.12, 0.14, 0.17);

export async function generarPdfAceptacion({ datos, firmaPng, fecha, fechaTexto, ip, id, hash }) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${terminos.titulo} – Aceptación de ${datos.nombre}`);
  pdf.setAuthor('GOTFIX S.A.S.');
  pdf.setSubject(`Versión ${terminos.version}`);
  pdf.setCreationDate(fecha);

  const normal = await pdf.embedFont(StandardFonts.Helvetica);
  const negrita = await pdf.embedFont(StandardFonts.HelveticaBold);
  const doc = new Maquetador(pdf, normal, negrita);

  // Encabezado
  doc.texto([{ t: terminos.empresa, b: true }], { tamano: 10, color: AZUL, espacioDespues: 4 });
  doc.texto([{ t: terminos.titulo, b: true }], { tamano: 17, color: MARINO, interlineado: 1.25, espacioDespues: 4 });
  doc.texto([{ t: terminos.lugarYVersion }], { tamano: 10, color: GRIS, espacioDespues: 8 });
  doc.linea(AZUL, 1.5);
  doc.espacio(14);

  for (const p of terminos.introduccion) doc.texto([{ t: p }]);

  for (const s of terminos.secciones) {
    doc.espacio(6);
    doc.texto([{ t: `${s.numero}. ${s.titulo}`, b: true }], { tamano: 12, color: MARINO, conservarConSiguiente: true });
    for (const b of s.bloques) {
      if (b.tipo === 'subtitulo') doc.texto([{ t: b.texto, b: true }], { conservarConSiguiente: true });
      else if (b.tipo === 'parrafo') doc.texto([{ t: b.texto }]);
      else
        for (const item of b.items)
          doc.texto(item.etiqueta ? [{ t: `${item.etiqueta} `, b: true }, { t: item.texto }] : [{ t: item.texto }], {
            vineta: true,
            espacioDespues: 5,
          });
    }
  }

  // Constancia de aceptación
  doc.nuevaPagina();
  doc.texto([{ t: 'Constancia de aceptación electrónica', b: true }], { tamano: 15, color: MARINO, espacioDespues: 6 });
  doc.linea(AZUL, 1.5);
  doc.espacio(14);
  doc.texto([{ t: terminos.aceptacion.texto }], { espacioDespues: 14 });

  const filas = [
    ['Nombre', datos.nombre],
    ['Cédula / NIT', datos.documento],
    ['Correo', datos.correo],
    ['WhatsApp', datos.whatsapp],
    ['Equipo', datos.equipo],
    ['N.º de orden', datos.orden || 'No indicado'],
    ['Fecha y hora', `${fechaTexto} (hora de Colombia)`],
    ['Versión aceptada', terminos.version],
    ['Acepta Términos y Condiciones', 'Sí'],
    ['Autoriza tratamiento de datos', 'Sí'],
    ['Dirección IP', ip || 'No disponible'],
    ['Identificador', id],
    ['Huella del documento (SHA-256)', hash],
  ];
  for (const [etiqueta, valor] of filas) doc.fila(etiqueta, valor);

  doc.espacio(24);
  const imagen = await pdf.embedPng(firmaPng);
  const escala = Math.min(220 / imagen.width, 90 / imagen.height, 1);
  doc.imagen(imagen, imagen.width * escala, imagen.height * escala);
  doc.linea(TEXTO, 0.6, 240);
  doc.espacio(4);
  doc.texto([{ t: datos.nombre, b: true }], { tamano: 10, espacioDespues: 0 });
  doc.texto([{ t: `C.C. / NIT ${datos.documento}` }], { tamano: 10, color: GRIS });

  doc.piesDePagina(`${terminos.empresa} · ${terminos.titulo} · Versión ${terminos.version}`);
  return pdf.save();
}

// Coloca texto con saltos de línea y de página automáticos.
class Maquetador {
  constructor(pdf, normal, negrita) {
    this.pdf = pdf;
    this.fuentes = { normal, negrita };
    this.nuevaPagina();
  }

  nuevaPagina() {
    this.pagina = this.pdf.addPage([ANCHO, ALTO]);
    this.y = ALTO - MARGEN;
  }

  espacio(puntos) {
    this.y -= puntos;
  }

  asegurar(alto) {
    if (this.y - alto < MARGEN + 20) this.nuevaPagina();
  }

  // Las fuentes estándar del PDF no tienen todos los caracteres: se reemplazan los que falten.
  limpiar(texto, fuente) {
    return [...String(texto).replace(/[\u00a0\u202f\u2009]/g, ' ')]
      .map((c) => {
        try {
          fuente.encodeText(c);
          return c;
        } catch {
          return '?';
        }
      })
      .join('');
  }

  // segmentos: [{ t: 'texto', b: negrita? }]
  texto(segmentos, { tamano = 10.5, color = TEXTO, interlineado = 1.45, espacioDespues = 8, vineta = false, conservarConSiguiente = false } = {}) {
    const sangria = vineta ? 14 : 0;
    const palabras = segmentos.flatMap(({ t, b }) => {
      const fuente = b ? this.fuentes.negrita : this.fuentes.normal;
      return this.limpiar(t, fuente)
        .split(/(?<= )/)
        .filter(Boolean)
        .map((p) => ({ p, fuente }));
    });

    const lineas = [];
    let linea = [];
    let ancho = 0;
    for (const palabra of palabras) {
      const w = palabra.fuente.widthOfTextAtSize(palabra.p, tamano);
      const wSinEspacio = palabra.fuente.widthOfTextAtSize(palabra.p.trimEnd(), tamano);
      if (linea.length && ancho + wSinEspacio > ANCHO_TEXTO - sangria) {
        lineas.push(linea);
        linea = [];
        ancho = 0;
      }
      linea.push({ ...palabra, w });
      ancho += w;
    }
    if (linea.length) lineas.push(linea);

    const altoLinea = tamano * interlineado;
    if (conservarConSiguiente) this.asegurar(altoLinea * (lineas.length + 3));

    lineas.forEach((l, i) => {
      this.asegurar(altoLinea);
      const base = this.y - tamano;
      if (vineta && i === 0) {
        this.pagina.drawCircle({ x: MARGEN + 4, y: base + tamano * 0.32, size: 1.6, color: MARINO });
      }
      let x = MARGEN + sangria;
      for (const { p, fuente, w } of l) {
        this.pagina.drawText(p, { x, y: base, size: tamano, font: fuente, color });
        x += w;
      }
      this.y -= altoLinea;
    });
    this.y -= espacioDespues;
  }

  fila(etiqueta, valor) {
    const tamano = 10;
    const anchoEtiqueta = 175;
    const fuente = this.fuentes.normal;
    const texto = this.limpiar(valor, fuente);
    // Valores largos (como la huella SHA-256) se parten por caracteres.
    const lineas = [];
    let actual = '';
    for (const c of texto) {
      if (fuente.widthOfTextAtSize(actual + c, tamano) > ANCHO_TEXTO - anchoEtiqueta) {
        const corte = actual.lastIndexOf(' ');
        if (corte > 0 && /\s/.test(texto)) {
          lineas.push(actual.slice(0, corte));
          actual = actual.slice(corte + 1);
        } else {
          lineas.push(actual);
          actual = '';
        }
      }
      actual += c;
    }
    lineas.push(actual);

    const alto = lineas.length * 14 + 8;
    this.asegurar(alto);
    this.pagina.drawText(this.limpiar(etiqueta, fuente), { x: MARGEN, y: this.y - 12, size: 9.5, font: fuente, color: GRIS });
    lineas.forEach((l, i) =>
      this.pagina.drawText(l, { x: MARGEN + anchoEtiqueta, y: this.y - 12 - i * 14, size: tamano, font: this.fuentes.negrita, color: TEXTO }),
    );
    this.y -= alto;
    this.pagina.drawLine({
      start: { x: MARGEN, y: this.y + 3 },
      end: { x: ANCHO - MARGEN, y: this.y + 3 },
      thickness: 0.4,
      color: rgb(0.85, 0.87, 0.9),
    });
  }

  linea(color, grosor, ancho = ANCHO_TEXTO) {
    this.pagina.drawLine({ start: { x: MARGEN, y: this.y }, end: { x: MARGEN + ancho, y: this.y }, thickness: grosor, color });
    this.y -= grosor;
  }

  imagen(imagen, ancho, alto) {
    this.asegurar(alto + 40);
    this.pagina.drawImage(imagen, { x: MARGEN, y: this.y - alto, width: ancho, height: alto });
    this.y -= alto + 4;
  }

  piesDePagina(texto) {
    const paginas = this.pdf.getPages();
    const fuente = this.fuentes.normal;
    const limpio = this.limpiar(texto, fuente);
    paginas.forEach((p, i) => {
      const numero = `Página ${i + 1} de ${paginas.length}`;
      p.drawText(limpio, { x: MARGEN, y: 30, size: 8, font: fuente, color: GRIS });
      p.drawText(numero, { x: ANCHO - MARGEN - fuente.widthOfTextAtSize(numero, 8), y: 30, size: 8, font: fuente, color: GRIS });
    });
  }
}
