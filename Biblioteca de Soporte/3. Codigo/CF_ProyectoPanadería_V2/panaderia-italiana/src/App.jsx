import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoriaList from './components/CategoriaList';
import ProductoList from './components/ProductoList';
import Cuenta from './components/Cuenta';
import AdminCategorias from './components/AdminCategorias';
import AdminProductos from './components/AdminProductos';
import AdminCuentas from './components/AdminCuentas';
import AdminOrdenes from './components/AdminOrdenes';
import Carrito from './pages/Carrito';
import Pago from './pages/Pago';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tokenRol, setTokenRol] = useState(localStorage.getItem('rol') || '');

  const handleLogin = (tok, rol) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('rol', rol);
    setToken(tok);
    setTokenRol(rol);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setToken('');
    setTokenRol('');
  };

  return (
    <BrowserRouter>
      <div className="bg-white shadow-md sticky top-0 z-50">
        <Navbar token={token} tokenRol={tokenRol} onLogout={handleLogout} />
      </div>

      <main className="px-4 py-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<CategoriaList />} />
          <Route path="/productos" element={<ProductoList />} />
          <Route path="/cuenta" element={<Cuenta token={token} onLogin={handleLogin} />} />
          <Route path="/productos/categoria/:id" element={<ProductoList />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago" element={<Pago />} />

          {/* Rutas protegidas para admin */}
          <Route
            path="/admin/categorias"
            element={token && tokenRol === 'admin' ? <AdminCategorias token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route
            path="/admin/productos"
            element={token && tokenRol === 'admin' ? <AdminProductos token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route
            path="/admin/cuentas"
            element={token && tokenRol === 'admin' ? <AdminCuentas token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route
            path="/admin/ordenes"
            element={token && tokenRol === 'admin' ? <AdminOrdenes /> : <Navigate to="/cuenta" replace />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
