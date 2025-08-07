import React, { useEffect, useState } from "react";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message));
  }, []);

  const abrirModal = (producto) => setProductoSeleccionado(producto);
  const cerrarModal = () => setProductoSeleccionado(null);

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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Productos</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {productos.length === 0 && <p>No hay productos disponibles.</p>}

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
        backgroundColor: "#fff",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontSize: "18px",
      }}
    >
      <h3>{p.nombre}</h3>
      <img
        src={
          p.foto?.startsWith("http")
            ? p.foto
            : `http://localhost:4000/uploads/${p.foto}`
        }
        alt={p.nombre}
        width="200"
        style={{ borderRadius: 10, marginBottom: 15 }}
        onError={(e) => (e.target.style.display = "none")}
      />
      <p style={{ fontWeight: "bold", fontSize: "20px" }}>
        ${parseFloat(p.precio).toFixed(2)}
      </p>
      <button
        onClick={() => abrirModal(p)}
        style={{
          marginTop: 12,
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 14px",
          borderRadius: 6,
          fontSize: "16px",
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
            top: 0, left: 0, right: 0, bottom: 0,
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
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h2>{productoSeleccionado.nombre}</h2>
            <img
              src={
                productoSeleccionado.foto?.startsWith("http")
                  ? productoSeleccionado.foto
                  : `http://localhost:4000/uploads/${productoSeleccionado.foto}`
              }
              alt={productoSeleccionado.nombre}
              width="200"
              style={{ borderRadius: 10, marginBottom: 15 }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
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
