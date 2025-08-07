import React, { useState, useEffect } from 'react';

export default function Pago({ cerrarModal }) {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [exito, setExito] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carritoGuardado.reduce((acc, p) => acc + parseFloat(p.precio) * p.cantidad, 0);
    setCarrito(carritoGuardado);
    setTotal(total);
  }, []);

  const handlePagar = async (e) => {
    e.preventDefault();

    if (!nombre || !numero || !vencimiento || !cvv || !correo) {
      return setError('Completa todos los campos');
    }

    if (!/^[0-9]{16}$/.test(numero)) {
      return setError('El número de tarjeta debe tener 16 dígitos');
    }

    if (!/^[0-9]{2}\/[0-9]{2}$/.test(vencimiento)) {
      return setError('Formato de vencimiento inválido (MM/AA)');
    }

    if (!/^[0-9]{3,4}$/.test(cvv)) {
      return setError('CVV inválido');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return setError('Correo inválido');
    }

    try {
      const res = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrito, correo })
      });

      if (!res.ok) throw new Error('Error al registrar orden');

      localStorage.removeItem('carrito');
      setExito(true);

      setTimeout(() => {
        setExito(false);
        cerrarModal();
      }, 2500);

    } catch (err) {
      setError('Ocurrió un error al procesar el pago');
    }
  };

  return (
    <div className="pago-modal">
      {exito && (
        <div className="modal-exito">
          <div className="check-animation">
            <div className="check-mark"></div>
          </div>
          <p>✅ Pago realizado con éxito.<br />Orden enviada al correo 📧</p>
        </div>
      )}

      {!exito && (
        <>
          <h2 className="pago-titulo">💳 Pagar total: ${total.toFixed(2)}</h2>

          <form onSubmit={handlePagar} className="pago-formulario">
            <div className="pago-grid">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="pago-input"
              />
              <input
                type="text"
                placeholder="Nombre del titular"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="pago-input"
              />
              <input
                type="text"
                placeholder="Número de tarjeta (16 dígitos)"
                value={numero}
                maxLength={16}
                onChange={(e) => setNumero(e.target.value)}
                className="pago-input"
              />
              <input
                type="text"
                placeholder="Vencimiento (MM/AA)"
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
                className="pago-input"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                maxLength={4}
                onChange={(e) => setCvv(e.target.value)}
                className="pago-input"
              />
            </div>

            {error && <p className="pago-error">{error}</p>}

            <div className="pago-botones">
              <button type="submit" className="pago-btn pagar">Confirmar pago</button>
              <button type="button" onClick={cerrarModal} className="pago-btn cancelar">Cancelar</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
