const pool = require('../config/db');
const { generarPDFOrden } = require('../utils/pdf');
const { enviarOrden } = require('../utils/mailer');

exports.crearOrden = async (req, res, next) => {
  const { carrito, correo } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }
  if (!correo) {
    return res.status(400).json({ error: 'Correo del cliente es requerido' });
  }

  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio) * p.cantidad, 0);

  try {
    await pool.query('BEGIN');

    // Verificar stock
    for (let p of carrito) {
      const stockRes = await pool.query('SELECT stock, nombre FROM productos WHERE id = $1', [p.id]);
      const producto = stockRes.rows[0];
      if (!producto) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Producto con ID ${p.id} no existe.` });
      }

      const cantidad = parseInt(p.cantidad);
      const stock = parseInt(producto.stock);
      if (isNaN(cantidad) || cantidad <= 0) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Cantidad inválida para "${producto.nombre}".` });
      }

      if (stock < cantidad) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Stock insuficiente para "${producto.nombre}". Solo quedan ${stock} unidades.` });
      }
    }

    // Insertar orden
    const ordenRes = await pool.query(
      'INSERT INTO ordenes (total) VALUES ($1) RETURNING id, fecha',
      [total]
    );
    const { id: ordenId, fecha } = ordenRes.rows[0];

    const productos = [];
for (let p of carrito) {
  const precio = parseFloat(p.precio);
  const cantidad = parseInt(p.cantidad);
  const subtotal = precio * cantidad;

  productos.push({
    producto_nombre: p.nombre,
    cantidad,
    precio,
    subtotal,
  });

  await pool.query(
    'INSERT INTO orden_detalle (orden_id, producto_id, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
    [ordenId, p.id, cantidad, subtotal]
  );

  await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [cantidad, p.id]);
}


    await pool.query('COMMIT');

    
    // Generar y enviar PDF
    const pdfBuffer = await generarPDFOrden({ id: ordenId, fecha, total, productos });
    await enviarOrden(correo, pdfBuffer);

    res.status(201).json({ message: 'Orden creada y enviada correctamente', ordenId });
  } catch (err) {
    await pool.query('ROLLBACK');
    next(err);
  }
};

exports.getOrdenes = async (req, res, next) => {
  const { pagina = 1, limite = 10, desde, hasta } = req.query;
  const offset = (pagina - 1) * limite;

  try {
    let query = `
      SELECT o.id, o.total, o.fecha, 
             json_agg(json_build_object(
               'producto_nombre', p.nombre,
               'cantidad', od.cantidad,
               'subtotal', od.subtotal
             )) AS productos
      FROM ordenes o
      JOIN orden_detalle od ON o.id = od.orden_id
      JOIN productos p ON p.id = od.producto_id
      WHERE 1 = 1
    `;
    const params = [];

    if (desde) {
  params.push(`${desde} 23:59:59`);
  query += ` AND o.fecha >= $${params.length}`;
}
if (hasta) {
  params.push(`${hasta} 23:59:59`);
  query += ` AND o.fecha <= $${params.length}`;
}


    query += `
      GROUP BY o.id
      ORDER BY o.fecha DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limite, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
