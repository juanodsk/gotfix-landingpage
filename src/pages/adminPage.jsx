import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [formularios, setFormularios] = useState([]);
  const [fuente, setFuente] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchFormularios();
  }, [page, fuente]);

  const fetchFormularios = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST_URI}/api/registro`,
        {
          params: { page, limit, fuente },
        }
      );
      setFormularios(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error al cargar los formularios:", err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URI}/api/registro?csv=true${
          fuente ? `&fuente=${fuente}` : ""
        }`
      );
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "registros_masterclass.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar el archivo:", err);
      alert("No se pudo descargar el archivo.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Registros de formularios</h2>

        <div className="flex gap-4">
          <select
            value={fuente}
            onChange={(e) => {
              setFuente(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Todos</option>
            <option value="organico">Orgánico</option>
            <option value="pauta">Pauta</option>
            <option value="desconocido">Desconocido</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Descargar Excel
          </button>
        </div>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Fuente</th>
            <th className="p-2 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map((f) => (
            <tr key={f._id}>
              <td className="p-2 border">{f.nombre}</td>
              <td className="p-2 border">{f.correo}</td>
              <td className="p-2 border">{f.fuente}</td>
              <td className="p-2 border">
                {new Date(f.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Anterior
        </button>

        <span className="text-center font-medium">Página {page}</span>

        <button
          onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          disabled={page * limit >= total}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
