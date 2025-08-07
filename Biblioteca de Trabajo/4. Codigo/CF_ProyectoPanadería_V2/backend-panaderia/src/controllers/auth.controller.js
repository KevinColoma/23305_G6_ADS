console.log('📦 [auth.controller] cargado');

const pool  = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env');

// Registro de usuarios
exports.register = async (req, res, next) => {
  console.log('🔓 [register] body recibido:', req.body);
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    const exists = await pool.query('SELECT 1 FROM cuentas WHERE usuario=$1', [usuario]);
    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashed  = await bcrypt.hash(contrasena, 10);
    const userRol = rol || 'usuario';
    const result  = await pool.query(
      'INSERT INTO cuentas (usuario, contrasena, rol) VALUES ($1,$2,$3) RETURNING id, usuario, rol',
      [usuario, hashed, userRol]
    );

    res.status(201).json({
      message: 'Usuario creado',
      usuario: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Login de usuarios
exports.login = async (req, res, next) => {
  console.log('🔓 [login] body recibido:', req.body);
  const { usuario, contrasena } = req.body;

  try {
    const result = await pool.query('SELECT * FROM cuentas WHERE usuario=$1', [usuario]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user  = result.rows[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });
  } catch (err) {
    next(err);
  }
};
