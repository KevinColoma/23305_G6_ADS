import React, { useEffect, useState } from "react";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/productos')
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Productos</h1>
      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {productos.map(p => (
            <li key={p.id}>{p.nombre} - ${p.precio}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
