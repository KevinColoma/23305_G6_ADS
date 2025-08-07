import { useEffect, useState } from "react";

export default function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/categorias')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar categorías');
        return res.json();
      })
      .then(data => {
        setCategorias(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando categorías...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (categorias.length === 0) return <p>No hay categorías disponibles.</p>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>Categorías</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
          gap: "40px",
        }}
      >
        {categorias.map(cat => (
          <div
            key={cat.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 30,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            <h3 style={{ marginBottom: 15 }}>{cat.nombre}</h3>
            {cat.foto && (
              <img
                src={cat.foto.startsWith("http")
                  ? cat.foto
                  : `http://localhost:4000/uploads/${cat.foto}`}
                alt={cat.nombre}
                width="200"
                style={{ borderRadius: 10, marginBottom: 15 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <p style={{ fontSize: "16px", color: "#555" }}>
              {cat.descripcion || "Sin descripción"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
