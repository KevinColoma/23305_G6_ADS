import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { usuario, contrasena }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { token, usuario: user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(user));
      localStorage.setItem('rol', user.rol); // ⬅️ guardar rol

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (onLogin) onLogin(token, user.rol); // ⬅️ pasar token y rol

      navigate('/cuenta');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error en el login');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center' }}>Iniciar sesión</h2>
      {mensaje && <p style={{ color: 'red', textAlign: 'center' }}>{mensaje}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <label>Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="usuario"
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          placeholder="contraseña"
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <button type="submit" style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#0f3996ff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Entrar
      </button>
    </form>
  );
}
