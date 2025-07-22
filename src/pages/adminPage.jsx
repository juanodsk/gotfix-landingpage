import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_HOST_URI;

const AdminPage = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuente, setFuente] = useState("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchFormularios = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (fuente !== "todos") queryParams.append("fuente", fuente);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const res = await axios.get(`${API_URL}/api/formularios?${queryParams}`);
      setFormularios(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error al cargar los formularios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, [fuente, page]);

  const handleFiltroChange = (e) => {
    setFuente(e.target.value);
    setPage(1); // Resetear a página 1 al cambiar filtro
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Registros de Formularios</h1>

      {/* Filtro */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por fuente:</label>
        <select
          value={fuente}
          onChange={handleFiltroChange}
          className="border px-3 py-1 rounded"
        >
          <option value="todos">Todos</option>
          <option value="organico">Orgánico</option>
          <option value="pauta">Pauta</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center mt-10">Cargando...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Nombre</th>
                  <th className="border px-4 py-2 text-left">Correo</th>
                  <th className="border px-4 py-2 text-left">Fuente</th>
                  <th className="border px-4 py-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {formularios.map((f) => (
                  <tr key={f._id}>
                    <td className="border px-4 py-2">{f.nombre}</td>
                    <td className="border px-4 py-2">{f.correo}</td>
                    <td className="border px-4 py-2 capitalize">{f.fuente}</td>
                    <td className="border px-4 py-2">
                      {new Date(f.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <p>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </p>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
