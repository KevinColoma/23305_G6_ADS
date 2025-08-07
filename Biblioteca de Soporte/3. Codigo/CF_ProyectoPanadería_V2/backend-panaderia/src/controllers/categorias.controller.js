const pool = require('../config/db');

// Obtener todas las categorías
exports.getAllCategorias = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categorias ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Crear nueva categoría
exports.createCategoria = async (req, res, next) => {
  const { nombre, descripcion } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : '/uploads/logo.png'; // ✅ foto por defecto

  try {
    const { rows } = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, foto)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, descripcion, foto]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Actualizar categoría por ID
exports.updateCategoria = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const nuevaFoto = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query, params;

    if (nuevaFoto) {
      // ✅ si se subió nueva foto
      query = 'UPDATE categorias SET nombre=$1, descripcion=$2, foto=$3 WHERE id=$4 RETURNING *';
      params = [nombre, descripcion, nuevaFoto, id];
    } else {
      // ✅ obtener foto actual o poner imagen por defecto
      const resultFoto = await pool.query('SELECT foto FROM categorias WHERE id=$1', [id]);
      const fotoActual = resultFoto.rows[0]?.foto || '/uploads/logo.png';

      query = 'UPDATE categorias SET nombre=$1, descripcion=$2, foto=$3 WHERE id=$4 RETURNING *';
      params = [nombre, descripcion, fotoActual, id];
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Eliminar categoría por ID
exports.deleteCategoria = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    next(err);
  }
};
