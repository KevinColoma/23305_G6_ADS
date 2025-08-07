// src/routes/categorias.routes.js
const express = require('express');
const router  = express.Router();
const upload = require('../config/multer');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');
const {
  getAllCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require('../controllers/categorias.controller');

router.get('/', getAllCategorias);
router.post('/', verificarToken, soloAdmin, upload.single('foto'), createCategoria);
router.put('/:id', verificarToken, soloAdmin, upload.single('foto'), updateCategoria);
router.delete('/:id', verificarToken, soloAdmin, deleteCategoria);

module.exports = router;
