// src/routes/productos.routes.js
const express = require('express');
const router  = express.Router();
const upload = require('../config/multer');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');
const {
  getAllProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getByCategoria,
  buscarProductos
} = require('../controllers/productos.controller');
const { filtrarProductos } = require('../controllers/productos.controller');

router.get('/', getAllProductos);
router.get('/categoria/:id', getByCategoria);
router.get('/buscar', buscarProductos);
router.post('/', verificarToken, soloAdmin, upload.single('foto'), createProducto);
router.put('/:id', verificarToken, soloAdmin, upload.single('foto'), updateProducto);
router.delete('/:id', verificarToken, soloAdmin, deleteProducto);
router.get('/filtro', filtrarProductos);

module.exports = router;