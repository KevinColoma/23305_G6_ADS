import React, { useEffect, useState } from 'react';
import './AdminCuentas.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AdminCuentas({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm]         = useState({ usuario: '', contrasena: '', rol: 'usuario' });
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje]     = useState('');

  useEffect(() => { fetchUsuarios(); }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsuarios(await res.json());
      setMensaje('');
    } catch (e) {
      setMensaje(e.message);
    }
  };

  const resetForm = () => {
    setForm({ usuario: '', contrasena: '', rol: 'usuario' });
    setEditingId(null);
    setMensaje('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.usuario || (!editingId && !form.contrasena)) {
      setMensaje('Usuario y contraseña (solo para nuevo) son obligatorios');
      return;
    }
    try {
      const url    = editingId
        ? `${API_URL}/usuarios/${editingId}`
        : `${API_URL}/auth/register`;
      const method = editingId ? 'PUT' : 'POST';
      const headers = { 'Content-Type': 'application/json' };
      if (editingId) headers.Authorization = `Bearer ${token}`;

      const body = editingId
        ? JSON.stringify({ usuario: form.usuario, rol: form.rol })
        : JSON.stringify(form);

      const res = await fetch(url, { method, headers, body });
      if (!res.ok) throw new Error((await res.json()).error);
      setMensaje(editingId ? 'Usuario actualizado' : 'Usuario creado');
      resetForm();
      fetchUsuarios();
    } catch (e) {
      setMensaje(e.message);
    }
  };

  const handleEdit = user => {
    setForm({ usuario: user.usuario, contrasena: '', rol: user.rol });
    setEditingId(user.id);
    setMensaje('');
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMensaje('Usuario eliminado');
      fetchUsuarios();
    } catch (e) {
      setMensaje(e.message);
    }
  };

  return (
    <section className="admin-container">
      <div className="admin-panels">

        {/* Panel Formulario */}
        <div className="panel-card">
          <h2 className="panel-title">Administrar Cuentas</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Usuario</label>
              <input
                name="usuario"
                placeholder="usuario"
                value={form.usuario}
                onChange={handleChange}
                required
              />
            </div>
            {!editingId && (
              <div className="field">
                <label>Contraseña</label>
                <input
                  name="contrasena"
                  type="password"
                  placeholder="contraseña"
                  value={form.contrasena}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="field">
              <label>Rol</label>
              <select name="rol" value={form.rol} onChange={handleChange}>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-clear-cuentas" onClick={resetForm}>
                Limpiar
              </button>
              <button type="submit" className="btn btn-submit">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
          {mensaje && (
            <p className={`mensaje ${mensaje.toLowerCase().includes('error') ? 'error' : 'success'}`}>
              {mensaje}
            </p>
          )}
        </div>

        {/* Panel Lista de usuarios */}
        <div className="panel-card">
          <h2 className="panel-title">Usuarios</h2>
          <ul className="user-list">
            {usuarios.length === 0 && (
              <li className="info">No hay usuarios aún.</li>
            )}
            {usuarios.map(u => (
              <li key={u.id}>
                <div className="info">
                  <strong>{u.usuario}</strong>
                  <br />
                  <span>({u.rol})</span>
                </div>
                <div className="actions">
                  <button className="action-btn edit" onClick={() => handleEdit(u)}>
                    ✏️ Editar
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(u.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
