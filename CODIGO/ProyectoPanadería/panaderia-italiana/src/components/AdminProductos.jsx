import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminProductos({ token }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    fecha_hora_salida: '',
    fecha_hora_expedicion: '',
    foto: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:4000/productos');
      setProductos(res.data);
      setMensaje('');
    } catch {
      setMensaje('Error al cargar productos');
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:4000/categorias');
      setCategorias(res.data);
      setMensaje('');
    } catch {
      setMensaje('Error al cargar categorías');
    }
  };

  const resetForm = () => {
    setForm({
      categoria_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      fecha_hora_salida: '',
      fecha_hora_expedicion: '',
      foto: null,
    });
    setEditingId(null);
    setMensaje('');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setForm((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.categoria_id) {
      setMensaje('Nombre y categoría son obligatorios');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('categoria_id', form.categoria_id);
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('precio', form.precio);
      formData.append('fecha_hora_salida', form.fecha_hora_salida);
      formData.append('fecha_hora_expedicion', form.fecha_hora_expedicion);
      if (form.foto) formData.append('foto', form.foto);

      if (editingId) {
        await axios.put(`http://localhost:4000/productos/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMensaje('Producto actualizado');
      } else {
        await axios.post('http://localhost:4000/productos', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMensaje('Producto creado');
      }

      resetForm();
      fetchProductos();
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al guardar producto');
    }
  };

  const handleEdit = (prod) => {
    setForm({
      categoria_id: prod.categoria_id,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      fecha_hora_salida: prod.fecha_hora_salida?.slice(0, 16) || '',
      fecha_hora_expedicion: prod.fecha_hora_expedicion?.slice(0, 16) || '',
      foto: null,
    });
    setEditingId(prod.id);
    setMensaje('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await axios.delete(`http://localhost:4000/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje('Producto eliminado');
      fetchProductos();
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al eliminar producto');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Administrar Productos</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', minHeight: '60px' }}
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          step="0.01"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Fecha y hora de salida:
          <input
            type="datetime-local"
            name="fecha_hora_salida"
            value={form.fecha_hora_salida}
            onChange={handleChange}
            style={{ display: 'block', marginTop: '0.25rem', padding: '0.4rem', width: '100%' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Fecha y hora de expedición:
          <input
            type="datetime-local"
            name="fecha_hora_expedicion"
            value={form.fecha_hora_expedicion}
            onChange={handleChange}
            style={{ display: 'block', marginTop: '0.25rem', padding: '0.4rem', width: '100%' }}
          />
        </label>

        <input type="file" name="foto" accept="image/*" onChange={handleChange} />
        <br />
        <div style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {mensaje && (
        <p style={{ color: mensaje.toLowerCase().includes('error') ? 'red' : 'green', marginBottom: '1rem' }}>
          {mensaje}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productos.map((prod) => (
          <li
            key={prod.id}
            style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div>
              <strong>{prod.nombre}</strong> - {prod.descripcion} - ${prod.precio}
            </div>

            <div>
              <button
                onClick={() => handleEdit(prod)}
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
                onClick={() => handleDelete(prod.id)}
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
