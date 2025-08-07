// src/controllers/users.controller.js
const pool = require('../config/db');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, usuario, rol FROM cuentas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Actualizar usuario por ID
exports.updateUser = async (req, res, next) => {
  const { usuario, rol } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE cuentas SET usuario=$1, rol=$2 WHERE id=$3 RETURNING id, usuario, rol',
      [usuario, rol, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Eliminar usuario por ID
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cuentas WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
};
