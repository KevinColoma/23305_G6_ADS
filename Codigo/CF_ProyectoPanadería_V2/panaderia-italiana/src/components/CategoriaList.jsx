import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriaList.css"; // Asegúrate de importar el CSS

export default function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (cargando) return <p style={{ padding: 20 }}>Cargando menú...</p>;
  if (error) return <p style={{ color: 'red', padding: 20 }}>Error: {error}</p>;
  if (categorias.length === 0) return <p style={{ padding: 20 }}>No hay menús disponibles.</p>;

  return (
    <div className="categoria-wrapper">
      <h1 className="categoria-titulo">Menú Panadero</h1>
      <div className="categoria-grid">
        {categorias.map(cat => (
          <div key={cat.id} className="categoria-card">
            <h3>{cat.nombre}</h3>
            <img src={`http://localhost:4000${cat.foto}`} alt={cat.nombre} className="categoria-imagen" />
            <p>{cat.descripcion}</p>
            <button onClick={() => navigate(`/productos/categoria/${cat.id}`)}>
              Ver productos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
