import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Productos.css";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [productoAgregado, setProductoAgregado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch("http://localhost:4000/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error al cargar categorías", err));
  }, []);

  const toggleCategoria = (id) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = buscar.trim()
        ? `buscar=${encodeURIComponent(buscar)}`
        : '';

      const categoriasQuery = categoriasSeleccionadas.length > 0
        ? `categorias=${categoriasSeleccionadas.join(',')}`
        : '';

      const queryString = [query, categoriasQuery].filter(Boolean).join('&');
      const url = queryString
        ? `http://localhost:4000/productos/filtro?${queryString}`
        : id
          ? `http://localhost:4000/productos/categoria/${id}`
          : "http://localhost:4000/productos";

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar productos");
          return res.json();
        })
        .then((data) => {
          setProductos(data);
          setError(null);
        })
        .catch((err) => setError(err.message));
    }, 300);

    return () => clearTimeout(timeout);
  }, [buscar, categoriasSeleccionadas, id]);

  const abrirModal = (producto) => setProductoSeleccionado(producto);
  const cerrarModal = () => setProductoSeleccionado(null);

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      setError("❌ Este producto no tiene stock disponible");
      return;
    }

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carritoActual.findIndex((p) => p.id === producto.id);

    if (index !== -1) {
      if (carritoActual[index].cantidad >= producto.stock) {
        setError("⚠️ Has alcanzado el stock máximo disponible para este producto");
        return;
      }
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    window.dispatchEvent(new Event('carritoActualizado'));
    setProductoAgregado(producto.nombre);

    setTimeout(() => setProductoAgregado(null), 2000);
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

  return (
    <div className="productos-wrapper">
      <h1 className="productos-titulo">Productos</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o categoría..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        className="productos-buscador"
      />

      <div className="filtros-categorias">
        <label>Filtrar por menú:</label>
        <br />
        {categorias.map(cat => (
          <label key={cat.id} style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              checked={categoriasSeleccionadas.includes(cat.id)}
              onChange={() => toggleCategoria(cat.id)}
            />
            {cat.nombre}
          </label>
        ))}
        <br />
      </div>
        <br />
      {error && <p className="productos-error">Error: {error}</p>}

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="productos-grid">
          {productos.map((p) => (
            <div key={p.id} className="producto-card">
              <h3>{p.nombre}</h3>
              {p.foto && p.foto !== 'null' && (
                <img
                  src={`http://localhost:4000${p.foto}`}
                  alt={p.nombre}
                  className="producto-img"
                />
              )}
              <p className="producto-precio">${parseFloat(p.precio).toFixed(2)}</p>
              <p className="producto-stock">Stock: {p.stock}</p>

              <div className="botones-producto">
                <button onClick={() => abrirModal(p)} className="btn-ver">
                  Ver más
                </button>
                <button onClick={() => agregarAlCarrito(p)} className="btn-agregar">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2>{productoSeleccionado.nombre}</h2>
            {productoSeleccionado.foto && productoSeleccionado.foto !== 'null' && (
              <img
                src={`http://localhost:4000${productoSeleccionado.foto}`}
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
            <p className="producto-fecha">
              <strong>Salida:</strong> {formatearFecha(productoSeleccionado.fecha_hora_salida)}
            </p>
            <p className="producto-fecha">
              <strong>Vence:</strong> {formatearFecha(productoSeleccionado.fecha_hora_expedicion)}
            </p>

            <button className="btn-cerrar" onClick={cerrarModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {productoAgregado && (
        <div className="modal-carrito-exito">
          <div className="check-circle">
            <div className="check-mark"></div>
          </div>
          <p>{productoAgregado} añadido al carrito 🛒</p>
        </div>
      )}
    </div>
  );
}
