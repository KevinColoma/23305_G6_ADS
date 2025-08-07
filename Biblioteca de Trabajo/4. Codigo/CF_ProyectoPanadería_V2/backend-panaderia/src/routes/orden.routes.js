const express = require('express');
const router = express.Router();
const { crearOrden, getOrdenes } = require('../controllers/orden.controller');

router.post('/', crearOrden);
router.get('/', getOrdenes);

module.exports = router;
