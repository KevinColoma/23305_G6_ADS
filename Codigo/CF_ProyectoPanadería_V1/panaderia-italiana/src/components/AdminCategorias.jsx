import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCategorias({ token }) {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:4000/categorias');
      setCategorias(res.data);
    } catch {
      setMensaje('Error al cargar categorías');
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setFoto(null);
    setEditingId(null);
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setMensaje('El nombre es obligatorio');

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      if (foto) formData.append('foto', foto);

      if (editingId) {
        await axios.put(`http://localhost:4000/categorias/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMensaje('Categoría actualizada');
      } else {
        await axios.post('http://localhost:4000/categorias', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMensaje('Categoría creada');
      }

      resetForm();
      fetchCategorias();
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al guardar categoría');
    }
  };

  const handleEdit = (cat) => {
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion);
    setEditingId(cat.id);
    setMensaje('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    try {
      await axios.delete(`http://localhost:4000/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje('Categoría eliminada');
      fetchCategorias();
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al eliminar categoría');
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1rem',

        // Centrado vertical y horizontal
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // centra verticalmente
        alignItems: 'center',      // centra horizontalmente

        minHeight: '80vh',         // que ocupe casi toda la pantalla en alto
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Administrar Categorías</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', width: '100%' }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files[0])}
          style={{ marginBottom: '0.5rem' }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            style={{ background: '#4caf50', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{ background: '#ccc', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {mensaje && <p style={{ color: 'orange', marginBottom: '1rem' }}>{mensaje}</p>}

      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        {categorias.map((cat) => (
          <li
            key={cat.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.2rem' }}>{cat.nombre}</strong>
              <p style={{ margin: 0 }}>{cat.descripcion}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(cat)}
                style={{ background: '#1976d2', color: '#fff', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                style={{ background: '#d32f2f', color: '#fff', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px' }}
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
