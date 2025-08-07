import React, { useEffect, useState } from 'react';
import './Carrito.css';
import Pago from './Pago'; // ajusta si está en otra carpeta

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(datos);
  }, []);

  const actualizarCantidad = (id, cantidad) => {
    const nuevo = carrito.map(p =>
      p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
    );
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const eliminarProducto = (id) => {
    const nuevo = carrito.filter(p => p.id !== id);
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const subtotal = carrito.reduce((acc, p) => acc + parseFloat(p.precio) * p.cantidad, 0);
  const envio = subtotal > 0 ? 1 : 0;
  const total = subtotal;

  if (carrito.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>🛒 Tu carrito está vacío.</h2>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CARRITO</h1>
        {carrito.map(p => (
          <div key={p.id} className="carrito-producto">
            <img src={`http://localhost:4000${p.foto}`} alt={p.nombre} />
            <div className="carrito-info">
              <h3>{p.nombre}</h3>
              <p>ID: {p.id}</p>
              <p>${parseFloat(p.precio).toFixed(2)}</p>
              <div className="carrito-cantidad">
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={p.cantidad}
                  onChange={(e) => actualizarCantidad(p.id, parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => eliminarProducto(p.id)} className="eliminar-btn">
                Eliminar
              </button>
            </div>
            <div>
              <p style={{ fontWeight: 'bold' }}>
                ${(parseFloat(p.precio) * p.cantidad).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="resumen">
        <h2>RESUMEN DEL PEDIDO</h2>
        <div className="resumen-linea">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="resumen-linea">
          <span>Envío</span>
          <span>0%</span>
        </div>
        <div className="resumen-total">
          <span>Total Estimado</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button onClick={() => setMostrarModal(true)} className="boton-pagar">
          Pagar →
        </button>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center', color: '#666' }}>
          Paga con rapidez y seguridad
        </p>
      </div>

      {mostrarModal && (
        <div className="modal-fondo">
          <div className="modal">
            <Pago cerrarModal={() => setMostrarModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
