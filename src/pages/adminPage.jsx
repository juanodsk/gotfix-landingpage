import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_HOST_URI;

const AdminPage = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/registro`);
        if (res.data && Array.isArray(res.data.data)) {
          setFormularios(res.data.data); // ← AQUÍ se extrae el array
        } else {
          console.warn("La respuesta no contiene un array válido:", res.data);
        }
      } catch (err) {
        console.error("Error al cargar los formularios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormularios();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Registros de Formularios</h1>
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
    </div>
  );
};

export default AdminPage;
