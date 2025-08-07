import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProductos.css';

export default function AdminProductos({ token }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    fecha_hora_salida: '',
    fecha_hora_expedicion: '',
    foto: null,
  });
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:4000/productos');
      setProductos(res.data);
    } catch {
      setMensaje('Error al cargar productos');
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:4000/categorias');
      setCategorias(res.data);
    } catch {
      setMensaje('Error al cargar categorías');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      const file = files[0];
      if (file && !['image/png', 'image/jpeg'].includes(file.type)) {
        setMensaje('Solo se permiten imágenes JPG o PNG');
        return;
      }
      setForm((prev) => ({ ...prev, foto: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!form.nombre || !form.categoria_id || !form.precio || form.stock === '') {
      return setMensaje('Los campos con * son obligatorios');
    }

    if (
      form.fecha_hora_salida &&
      form.fecha_hora_expedicion &&
      new Date(form.fecha_hora_expedicion) < new Date(form.fecha_hora_salida)
    ) {
      return setMensaje('La fecha de expedición no puede ser anterior a la de salida');
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === 'foto' && form.foto instanceof File) {
          formData.append('foto', form.foto);
        } else if (key !== 'foto') {
          formData.append(key, form[key]);
        }
      }
      if (!(form.foto instanceof File)) {
        formData.append('foto', '');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingId) {
        await axios.put(`http://localhost:4000/productos/${editingId}`, formData, config);
        setMensaje('Producto actualizado');
      } else {
        await axios.post('http://localhost:4000/productos', formData, config);
        setMensaje('Producto creado');
      }

      resetForm();
      fetchProductos();
    } catch (err) {
      setMensaje('Error al guardar producto');
    }
  };

  const resetForm = () => {
    setForm({
      categoria_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      fecha_hora_salida: '',
      fecha_hora_expedicion: '',
      foto: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (prod) => {
    setForm({
      categoria_id: prod.categoria_id,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      stock: prod.stock,
      fecha_hora_salida: prod.fecha_hora_salida?.slice(0, 16) || '',
      fecha_hora_expedicion: prod.fecha_hora_expedicion?.slice(0, 16) || '',
      foto: null,
    });
    setPreview(prod.foto);
    setEditingId(prod.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`http://localhost:4000/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProductos();
    } catch {
      setMensaje('Error al eliminar producto');
    }
  };

  return (
    <div className="admin-productos">
      <div className="form-container">
        <h2>Administración de Productos</h2>
        <form onSubmit={handleSubmit}>
          <label>Escoge el menú al que pertenece *</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required>
            <option value="">Selecciona</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          <label>Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />

          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />

          <label>Precio *</label>
          <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} required />

          <label>Stock disponible *</label>
          <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} required />

          <label>Fecha y hora de salida a vitrina</label>
          <input type="datetime-local" name="fecha_hora_salida" value={form.fecha_hora_salida} onChange={handleChange} />

          <label>Fecha y hora de caducación</label>
          <input type="datetime-local" name="fecha_hora_expedicion" value={form.fecha_hora_expedicion} onChange={handleChange} />

          <label>Foto (JPG/PNG)</label>
          <div
            className={`drop-area ${isDragging ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
                setForm((prev) => ({ ...prev, foto: file }));
                setPreview(URL.createObjectURL(file));
              } else {
                setMensaje('Solo se permiten imágenes JPG o PNG');
              }
            }}
            onClick={() => document.getElementById('input-file').click()}
          >
            <p>📤 Arrastra una imagen o haz clic para seleccionar</p>
            <input
              type="file"
              id="input-file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
          </div>

          <button className="btn-submit" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>

      <div className="productos-list">
        <h3>Productos</h3>
          {productos.map((prod) => (
          <div key={prod.id} className="producto-item">
            <img src={`http://localhost:4000${prod.foto}`} alt={prod.nombre} className="producto-img-admin" />
            <div className="producto-info">
              <strong>{prod.nombre}</strong>
              <br/>
              <small>{prod.descripcion}</small>
              <br />
              <small>${prod.precio} — Stock: {prod.stock}</small>
            </div>
            <div className="producto-actions">
              <button onClick={() => handleEdit(prod)}>Editar</button>
              <button onClick={() => handleDelete(prod.id)}>Eliminar</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
