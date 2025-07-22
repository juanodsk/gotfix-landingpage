import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_HOST_URI;

const AdminPage = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFormularios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/registro`, {
        params: { page, search },
      });
      if (res.data?.data) {
        setFormularios(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setFormularios([]);
      }
    } catch (err) {
      console.error("Error al cargar los formularios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reinicia a la primera página al buscar
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Registros de Formularios</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 w-full px-4 py-2 border rounded"
      />

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : formularios.length === 0 ? (
        <p className="text-center">No hay resultados.</p>
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
                    <td className="border px-4 py-2 capitalize">
                      {f.fuente || "desconocido"}
                    </td>
                    <td className="border px-4 py-2">
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleString()
                        : "Sin fecha"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
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
