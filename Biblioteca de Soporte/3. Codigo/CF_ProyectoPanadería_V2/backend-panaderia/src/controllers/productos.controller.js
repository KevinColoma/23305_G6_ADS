// src/controllers/productos.controller.js
const pool = require('../config/db');

exports.buscarProductos = async (req, res, next) => {
  const { buscar } = req.query;

  try {
    let query = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE 1 = 1
    `;
    const values = [];

    if (buscar) {
      query += `
        AND (
          LOWER(p.nombre) LIKE $1 OR
          LOWER(c.nombre) LIKE $1
        )
      `;
      values.push(`%${buscar.toLowerCase()}%`);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};


// Obtener todos los productos
exports.getAllProductos = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Crear nuevo producto
exports.createProducto = async (req, res, next) => {
  const {
    categoria_id,
    nombre,
    descripcion,
    precio,
    stock, // ✅ AÑADIDO
    fecha_hora_salida,
    fecha_hora_expedicion,
  } = req.body;

  try {
    const catRes = await pool.query('SELECT 1 FROM categorias WHERE id = $1', [categoria_id]);
    if (catRes.rowCount === 0) {
      return res.status(400).json({ error: 'Categoría no encontrada. Por favor usa un ID válido.' });
    }
  } catch (err) {
    return next(err);
  }

  const foto = req.file ? `/uploads/${req.file.filename}` : '/uploads/logo.png';
  try {
    const { rows } = await pool.query(
      `INSERT INTO productos
         (categoria_id, nombre, descripcion, precio, stock, fecha_hora_salida, fecha_hora_expedicion, foto)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [categoria_id, nombre, descripcion, precio, stock || 0, fecha_hora_salida, fecha_hora_expedicion, foto]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'ID de categoría inválido (foreign key violation)' });
    }
    next(err);
  }
};


// Actualizar producto por ID
exports.updateProducto = async (req, res, next) => {
  const { id } = req.params;
  const {
    categoria_id,
    nombre,
    descripcion,
    precio,
    stock, // ✅
    fecha_hora_salida,
    fecha_hora_expedicion,
  } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query, params;
    if (foto) {
      query = `UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4, stock=$5, fecha_hora_salida=$6, fecha_hora_expedicion=$7, foto=$8 WHERE id=$9 RETURNING *`;
      params = [categoria_id, nombre, descripcion, precio, stock, fecha_hora_salida, fecha_hora_expedicion, foto, id];
    } else {
      query = `UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4, stock=$5, fecha_hora_salida=$6, fecha_hora_expedicion=$7 WHERE id=$8 RETURNING *`;
      params = [categoria_id, nombre, descripcion, precio, stock, fecha_hora_salida, fecha_hora_expedicion, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};


// Eliminar producto por ID
exports.deleteProducto = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM productos WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
};

// Obtener productos por categoría
exports.getByCategoria = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM productos WHERE categoria_id = $1 ORDER BY id',
      [id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Filtrar productos por búsqueda y múltiples categorías
exports.filtrarProductos = async (req, res, next) => {
  const { buscar, categorias } = req.query;

  try {
    let query = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE 1 = 1
    `;
    const values = [];
    let paramIndex = 1;

    if (buscar) {
      query += ` AND (
        LOWER(p.nombre) LIKE $${paramIndex} OR
        LOWER(p.descripcion) LIKE $${paramIndex}
      )`;
      values.push(`%${buscar.toLowerCase()}%`);
      paramIndex++;
    }

    if (categorias) {
      const ids = categorias.split(',').map(id => parseInt(id));
      const placeholders = ids.map(() => `$${paramIndex++}`).join(',');
      query += ` AND p.categoria_id IN (${placeholders})`;
      values.push(...ids);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
