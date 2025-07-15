import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { id } = useParams(); // <--- Recoge el ID de la categoría si está en la URL

  useEffect(() => {
    const url = id
      ? `http://localhost:4000/productos/categoria/${id}`
      : "http://localhost:4000/productos";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No disponible";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (productos.length === 0) return <p>No hay productos disponibles.</p>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>Productos</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
          gap: "40px",
        }}
      >
        {productos.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 30,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{p.nombre}</h3>
            {p.foto && p.foto !== 'null' && (
  <img
  src={
    p.foto && p.foto !== 'null'
      ? `http://localhost:4000${p.foto}`
      : '/logo.png' // <- imagen por defecto en public/
  }
  alt={p.nombre}
  width="200"
  style={{ borderRadius: 8, marginBottom: 15 }}
/>

)}

            <p style={{ fontWeight: "bold", marginBottom: 10 }}>
              ${parseFloat(p.precio).toFixed(2)}
            </p>
            <button
              onClick={() => abrirModal(p)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {productoSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={cerrarModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: 30,
              borderRadius: 10,
              width: "90%",
              maxWidth: 500,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h2>{productoSeleccionado.nombre}</h2>
            {productoSeleccionado.foto && productoSeleccionado.foto !== 'null' && (
  <img
  src={
    productoSeleccionado.foto && productoSeleccionado.foto !== 'null'
      ? `http://localhost:4000${productoSeleccionado.foto}`
      : '/logo.png'
  }
  alt={productoSeleccionado.nombre}
  width="200"
  style={{ borderRadius: 10, marginBottom: 15 }}
/>
)}

            <p><strong>Precio:</strong> ${parseFloat(productoSeleccionado.precio).toFixed(2)}</p>
            <p><strong>Descripción:</strong></p>
            <p style={{ color: "#555", marginBottom: 10 }}>
              {productoSeleccionado.descripcion || "Sin descripción"}
            </p>
            <p style={{ fontSize: 12, color: "#888" }}>
              <strong>Salida:</strong> {formatearFecha(productoSeleccionado.fecha_hora_salida)}
            </p>
            <p style={{ fontSize: 12, color: "#888" }}>
              <strong>Vence:</strong> {formatearFecha(productoSeleccionado.fecha_hora_expedicion)}
            </p>
            <button
              onClick={cerrarModal}
              style={{
                marginTop: 20,
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
