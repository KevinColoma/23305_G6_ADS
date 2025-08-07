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
    <div style={{ maxWidth: '1200px', margin: '2rem auto', display: 'flex', gap: '2rem' }}>
      {/* FORMULARIO */}
      <div style={{
        flex: 1,
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Administrar Productos</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 'bold' }}>Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          <label style={{ fontWeight: 'bold' }}>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}
          />

          <label style={{ fontWeight: 'bold' }}>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', minHeight: '80px' }}
          />

          <label style={{ fontWeight: 'bold' }}>Precio</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            step="0.01"
            placeholder="Precio"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}
          />

          <label style={{ fontWeight: 'bold' }}>Fecha y hora de salida</label>
          <input
            type="datetime-local"
            name="fecha_hora_salida"
            value={form.fecha_hora_salida}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}
          />

          <label style={{ fontWeight: 'bold' }}>Fecha y hora de expedición</label>
          <input
            type="datetime-local"
            name="fecha_hora_expedicion"
            value={form.fecha_hora_expedicion}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}
          />

          <label style={{ fontWeight: 'bold' }}>Foto</label>
          <input type="file" name="foto" accept="image/*" onChange={handleChange} style={{ marginBottom: '1rem' }} />

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: '#aaa',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Limpiar
            </button>
          </div>
        </form>

        {mensaje && (
          <p style={{
            color: mensaje.toLowerCase().includes('error') ? 'red' : 'green',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {mensaje}
          </p>
        )}
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div style={{ flex: 1.2 }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Productos Registrados</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productos.map((prod) => (
            <li
              key={prod.id}
              style={{
                backgroundColor: '#f1f1f1',
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: 8,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <strong>{prod.nombre}</strong> - {prod.descripcion} - ${prod.precio}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
  <button
    onClick={() => handleEdit(prod)}
    style={{
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
    </div>
  );
}
