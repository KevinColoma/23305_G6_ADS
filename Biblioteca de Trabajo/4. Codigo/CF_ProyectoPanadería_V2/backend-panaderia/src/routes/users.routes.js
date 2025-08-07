// src/routes/users.routes.js
const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/users.controller');

router.get('/', verificarToken, soloAdmin, getAllUsers);
router.put('/:id', verificarToken, soloAdmin, updateUser);
router.delete('/:id', verificarToken, soloAdmin, deleteUser);

module.exports = router;