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

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (tok) => {
    localStorage.setItem('token', tok);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <BrowserRouter>
      {/* Navbar fijo arriba */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <Navbar token={token} onLogout={handleLogout} />
      </div>

      {/* Contenido principal */}
      <main className="px-4 py-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<CategoriaList />} />
          <Route path="/productos" element={<ProductoList />} />
          <Route path="/cuenta" element={<Cuenta token={token} onLogin={handleLogin} />} />
          <Route
            path="/admin/categorias"
            element={token ? <AdminCategorias token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route
            path="/admin/productos"
            element={token ? <AdminProductos token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route
            path="/admin/cuentas"
            element={token ? <AdminCuentas token={token} /> : <Navigate to="/cuenta" replace />}
          />
          <Route path="/productos/categoria/:id" element={<ProductoList />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
