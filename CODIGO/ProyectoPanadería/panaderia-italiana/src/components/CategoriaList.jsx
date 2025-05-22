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
    <div className="categoria-list" style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Categorías</h1>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
          gap: 20,
        }}
      >
        {categorias.map(cat => (
          <div
            key={cat.id}
            className="categoria-card"
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              textAlign: 'center',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{cat.nombre}</h3>
            {cat.foto && (
              <img
                src={cat.foto}
                alt={cat.nombre}
                width="150"
                style={{ borderRadius: 8, marginBottom: 10 }}
              />
            )}
            <p style={{ fontSize: 14, color: '#555' }}>{cat.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
