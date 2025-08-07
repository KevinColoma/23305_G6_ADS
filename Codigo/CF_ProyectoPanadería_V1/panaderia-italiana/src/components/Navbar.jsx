import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ token, tokenRol, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">Panadería la Italiana</Link>
        </div>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={`menu ${menuOpen ? 'active' : ''}`}>
          <div className="menu-left">
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/categorias" onClick={() => setMenuOpen(false)}>Categorías</Link>
            <Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
          </div>

          <div className="menu-right">
            {token ? (
              <>
                <Link to="/admin/categorias" onClick={() => setMenuOpen(false)}>Admin Categorías</Link>
                <Link to="/admin/productos" onClick={() => setMenuOpen(false)}>Admin Productos</Link>
                <Link to="/admin/cuentas" onClick={() => setMenuOpen(false)}>Admin Cuentas</Link>
                <button onClick={onLogout} className="logout-btn">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/cuenta" className="login-btn" onClick={() => setMenuOpen(false)}>
                Cuenta
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
