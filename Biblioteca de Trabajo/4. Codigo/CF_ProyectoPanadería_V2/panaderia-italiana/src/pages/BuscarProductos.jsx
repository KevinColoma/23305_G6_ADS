import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function BuscarProductos() {
  const [buscar, setBuscar] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = async () => {
    if (!buscar.trim()) return setMensaje('Por favor, ingresa un término de búsqueda.');

    try {
      const res = await axios.get(`${API_URL}/productos/buscar?buscar=${buscar}`);
      if (res.data.length === 0) {
        setMensaje('No se encontraron productos.');
        setResultados([]);
      } else {
        setResultados(res.data);
        setMensaje('');
      }
    } catch (err) {
      console.error(err);
      setMensaje('Error al buscar productos.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Buscar Productos</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>

      {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {resultados.map(producto => (
          <div key={producto.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <img
              src={`${API_URL}/uploads/${producto.foto}`}
              alt={producto.nombre}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold text-lg">{producto.nombre}</h3>
            <p className="text-gray-600">{producto.descripcion}</p>
            <p className="text-blue-700 font-semibold mt-1">${producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
