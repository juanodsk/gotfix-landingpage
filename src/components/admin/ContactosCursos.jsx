import { EXPERIENCIAS_CURSO } from '../../data/experienciaCurso';
import { fechaAdmin } from '../../utils/fechaAdmin';

export default function ContactosCursos({ registros, pagina }) {
  return (
    <div className="admin-tabla-contenedor"><table className="admin-tabla admin-tabla-cursos" role="table">
      <caption className="admin-sr">Interesados en cursos, página {pagina}</caption>
      <thead role="rowgroup"><tr role="row">
        <th id="curso-persona" scope="col">Persona / Fecha</th>
        <th id="curso-contacto" scope="col">Contacto</th>
        <th id="curso-pais" scope="col">País</th>
        <th id="curso-experiencia" scope="col">Experiencia técnica</th>
      </tr></thead>
      <tbody role="rowgroup">{registros.map((registro) => <tr key={registro.id} role="row">
        <td role="cell" headers="curso-persona" data-label="Persona / Fecha"><strong>{registro.nombre}</strong><span>{fechaAdmin(registro.creado_en)}</span></td>
        <td role="cell" headers="curso-contacto" data-label="Contacto">
          <a className="admin-enlace" href={`mailto:${encodeURIComponent(registro.correo)}`}>{registro.correo}</a>
          <span><a className="admin-enlace" href={`https://wa.me/${registro.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{registro.whatsapp}</a></span>
        </td>
        <td role="cell" headers="curso-pais" data-label="País">{registro.pais}</td>
        <td role="cell" headers="curso-experiencia" data-label="Experiencia técnica">{EXPERIENCIAS_CURSO[registro.experiencia] || registro.experiencia}</td>
      </tr>)}</tbody>
    </table></div>
  );
}
