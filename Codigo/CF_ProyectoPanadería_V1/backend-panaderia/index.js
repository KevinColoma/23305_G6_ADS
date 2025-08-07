require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Crear carpeta uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Conexión PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'panaderia',
  password: 'cjgranda16',
  port: 5432,
});

// Registro usuario (público)
app.post('/register', async (req, res) => {
  const { usuario, contrasena, rol } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }
  try {
    const exists = await pool.query('SELECT 1 FROM cuentas WHERE usuario=$1', [usuario]);
    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const hashed = await bcrypt.hash(contrasena, 10);
    const userRol = rol || 'usuario'; // si envían rol, se usa, si no, default
    const result = await pool.query(
      'INSERT INTO cuentas (usuario, contrasena, rol) VALUES ($1, $2, $3) RETURNING id, usuario, rol',
      [usuario, hashed, userRol]
    );
    res.status(201).json({ message: 'Usuario creado', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en registro' });
  }
});

// Login usuario (público, solo para obtener token si quieres)
app.post('/login', async (req, res) => {
  // Puedes eliminar esta ruta si no quieres login o autenticación
  res.status(200).json({ message: 'Login no implementado (sin autenticación)' });
});

// Obtener usuarios (público)
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, usuario, rol FROM cuentas ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario (público)
app.put('/usuarios/:id', async (req, res) => {
  const { usuario, rol } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE cuentas SET usuario=$1, rol=$2 WHERE id=$3 RETURNING id, usuario, rol',
      [usuario, rol, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (público)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cuentas WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Categorías (CRUD público)
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

app.post('/categorias', upload.single('foto'), async (req, res) => {
  const { nombre, descripcion } = req.body;
  let fotoPath = null;
  if (req.file) fotoPath = `/uploads/${req.file.filename}`;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion, foto) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, fotoPath]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

app.put('/categorias/:id', upload.single('foto'), async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion } = req.body;
  let fotoPath = null;
  if (req.file) fotoPath = `/uploads/${req.file.filename}`;
  try {
    let query, params;
    if (fotoPath) {
      query = 'UPDATE categorias SET nombre=$1, descripcion=$2, foto=$3 WHERE id=$4 RETURNING *';
      params = [nombre, descripcion, fotoPath, id];
    } else {
      query = 'UPDATE categorias SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *';
      params = [nombre, descripcion, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

app.delete('/categorias/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

// Productos (CRUD público)
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/productos', upload.single('foto'), async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion } = req.body;
  let fotoPath = null;
  if (req.file) fotoPath = `/uploads/${req.file.filename}`;
  try {
    const result = await pool.query(
      `INSERT INTO productos (categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion, foto)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion, fotoPath]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.put('/productos/:id', upload.single('foto'), async (req, res) => {
  const id = req.params.id;
  const { categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion } = req.body;
  let fotoPath = null;
  if (req.file) fotoPath = `/uploads/${req.file.filename}`;
  try {
    let query, params;
    if (fotoPath) {
      query = `UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4, fecha_hora_salida=$5, fecha_hora_expedicion=$6, foto=$7 WHERE id=$8 RETURNING *`;
      params = [categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion, fotoPath, id];
    } else {
      query = `UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4, fecha_hora_salida=$5, fecha_hora_expedicion=$6 WHERE id=$7 RETURNING *`;
      params = [categoria_id, nombre, descripcion, precio, fecha_hora_salida, fecha_hora_expedicion, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/productos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM productos WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
