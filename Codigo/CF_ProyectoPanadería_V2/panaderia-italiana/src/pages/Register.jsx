import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Register({ onRegisterSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { usuario, contrasena });
      setMensaje(res.data.message);
      setUsuario('');
      setContrasena('');

      // 🟢 Mostrar alerta si es exitoso
      window.alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');

      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
        Registro de Usuario
      </h2>
      {mensaje && (
        <p
          style={{
            color: mensaje.toLowerCase().includes('éxito') ? 'green' : 'red',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}
        >
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          required
          style={{
            padding: '0.6rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
          style={{
            padding: '0.6rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.6rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </form>
    </>
  );
}
