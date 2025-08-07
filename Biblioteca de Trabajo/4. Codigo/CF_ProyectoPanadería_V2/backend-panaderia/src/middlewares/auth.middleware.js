const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env');

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function soloAdmin(req, res, next) {
  if (req.user.rol !== 'admin')
    return res.status(403).json({ error: 'Solo administradores' });
  next();
}

module.exports = { verificarToken, soloAdmin };
