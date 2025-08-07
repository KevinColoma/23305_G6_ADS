import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ token, tokenRol, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    setCantidadCarrito(total);

    // Escuchar cambios en el carrito desde otras partes
    window.addEventListener('carritoActualizado', actualizarCantidad);
    return () => window.removeEventListener('carritoActualizado', actualizarCantidad);
  }, []);

  const actualizarCantidad = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    setCantidadCarrito(total);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>Panadería <strong>la Italiana</strong></Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>☰</button>

        <div className={`menu ${menuOpen ? 'active' : ''}`}>
          <div className="menu-left">
            <Link to="/" onClick={closeMenu}>Inicio</Link>
            <Link to="/categorias" onClick={closeMenu}>Menú</Link>
            <Link to="/productos" onClick={closeMenu}>Productos</Link>
            <Link to="/carrito" className="carrito-link">
              🛒
              {cantidadCarrito > 0 && (
                <span className="carrito-badge">{cantidadCarrito}</span>
              )}
            </Link>
          </div>

          <div className="menu-right">
            {token ? (
              <>
                {tokenRol === 'admin' && (
                  <>
                    <Link to="/admin/categorias" onClick={closeMenu}>Admin Menú</Link>
                    <Link to="/admin/productos" onClick={closeMenu}>Admin Productos</Link>
                    <Link to="/admin/cuentas" onClick={closeMenu}>Admin Cuentas</Link>
                    <Link to="/admin/ordenes" onClick={closeMenu}>Ver Órdenes</Link>
                  </>
                )}
                <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
              </>
            ) : (
              <Link to="/cuenta" className="login-btn" onClick={closeMenu}>Cuenta</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
