import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ token, tokenRol, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={closeMenu}>Panadería <strong>la Italiana</strong></Link>
        </div>

        {/* Botón menú hamburguesa */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        {/* Menú */}
        <div className={`menu ${menuOpen ? 'active' : ''}`}>
          <div className="menu-left">
            <Link to="/" onClick={closeMenu}>Inicio</Link>
            <Link to="/categorias" onClick={closeMenu}>Categorías</Link>
            <Link to="/productos" onClick={closeMenu}>Productos</Link>
          </div>

          <div className="menu-right">
            {token ? (
              <>
                <Link to="/admin/categorias" onClick={closeMenu}>Admin Categorías</Link>
                <Link to="/admin/productos" onClick={closeMenu}>Admin Productos</Link>
                <Link to="/admin/cuentas" onClick={closeMenu}>Admin Cuentas</Link>
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
