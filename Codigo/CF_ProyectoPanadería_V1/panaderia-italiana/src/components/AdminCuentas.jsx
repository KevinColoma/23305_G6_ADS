import React, { useEffect, useState } from 'react';

export default function AdminCuentas({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ usuario: '', contrasena: '', rol: 'usuario' });
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:4000/usuarios' /*, { headers: { Authorization: `Bearer ${token}` } }*/);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
      setMensaje('');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const resetForm = () => {
    setForm({ usuario: '', contrasena: '', rol: 'usuario' });
    setEditingId(null);
    setMensaje('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.usuario || (!editingId && !form.contrasena)) {
      setMensaje('Usuario y contraseña (solo para nuevo) son obligatorios');
      return;
    }

    try {
      if (editingId) {
        // Actualizar usuario sin cambiar contraseña
        const res = await fetch(`http://localhost:4000/usuarios/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' /*, Authorization: `Bearer ${token}` */ },
          body: JSON.stringify({ usuario: form.usuario, rol: form.rol }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar usuario');
        }
        setMensaje('Usuario actualizado');
      } else {
        // Crear usuario
        const res = await fetch('http://localhost:4000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' /*, Authorization: `Bearer ${token}` */ },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear usuario');
        }
        setMensaje('Usuario creado');
      }
      resetForm();
      fetchUsuarios();
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ usuario: user.usuario, contrasena: '', rol: user.rol });
    setEditingId(user.id);
    setMensaje('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
      const res = await fetch(`http://localhost:4000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { /* Authorization: `Bearer ${token}` */ },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al eliminar usuario');
      }
      setMensaje('Usuario eliminado');
      fetchUsuarios();
    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Administrar Cuentas</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />

        {!editingId && (
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
        )}

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Admin</option>
        </select>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#ccc', border: 'none', borderRadius: 4 }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {mensaje && (
        <p style={{ color: mensaje.includes('error') || mensaje.includes('Error') ? 'red' : 'green', marginBottom: '1rem' }}>
          {mensaje}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {usuarios.map((user) => (
          <li
            key={user.id}
            style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{user.usuario}</strong> - Rol: {user.rol}
            </div>

            <div>
              <button
                onClick={() => handleEdit(user)}
                style={{
                  marginRight: 8,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
