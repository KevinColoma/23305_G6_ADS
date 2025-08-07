import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminCategorias.css';

export default function AdminCategorias({ token }) {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const imagenDefault = '/uploads/logo.png';


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
    setPreview(null);
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

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="admin-productos">
      <div className="form-container">
        <h2>{editingId ? 'Editar nuevo menú' : 'Crear nuevo menú'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <label>Foto (JPG/PNG)</label>
          <div
            className={`drop-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              handleFileSelect(file);
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img src={preview || imagenDefault} alt="Vista previa" className="preview-img" />
            ) : (
              <p>Arrastra una imagen o haz clic para seleccionar</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>

          <button type="submit" className="btn-submit">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn-submit"
            style={{ background: '#888' }}
          >
            Limpiar
          </button>

          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>

      <div className="productos-list">
        <h3>Listado de menús</h3>
        {categorias.map((cat) => (
          <div key={cat.id} className="producto-item">
            <div>
              <strong>{cat.nombre}</strong>
              <p>{cat.descripcion}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(cat)}>Editar</button>
              <button onClick={() => handleDelete(cat.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
