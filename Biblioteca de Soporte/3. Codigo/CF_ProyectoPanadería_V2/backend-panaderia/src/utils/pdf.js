const PDFDocument = require('pdfkit');
const MemoryStream = require('memory-streams');

exports.generarPDFOrden = async (orden) => {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new MemoryStream.WritableStream();
  doc.pipe(stream);

  doc
    .fontSize(20)
    .fillColor('#0D2C54')
    .text('Panadería Italiana', 0, 70, { align: 'center' })
    .text('ORDEN DE PEDIDO', 0, 50, { align: 'center' });


  // Datos de la orden
  doc
    .moveDown()
    .fontSize(12)
    .fillColor('black')
    .text(`Orden #: 0000${orden.id || '-'}`, { align: 'center' })
    .text(`Fecha: ${new Date(orden.fecha).toLocaleString('es-EC')}`, { align: 'center' })
    .text(`Total: $${parseFloat(orden.total).toFixed(2)}`, { align: 'center' })
    .moveDown();

  // Línea separadora
  doc.moveDown().lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  // Título de tabla
  doc.moveDown().fontSize(14).fillColor('#0D2C54').text('DETALLE DE PRODUCTOS', { underline: true, align: 'center' });

  const tableTop = doc.y + 10;
  const itemSpacing = 25;

  // Cabecera de la tabla
  doc
    .fontSize(12)
    .fillColor('white')
    .rect(50, tableTop, 500, 20)
    .fill('#0D2C54')
    .fillColor('white')
    .text('Producto', 55, tableTop + 5)
    .text('Cantidad', 200, tableTop + 5)
    .text('Precio/U', 300, tableTop + 5)
    .text('Subtotal', 420, tableTop + 5);

  let y = tableTop + 25;

  // Filas de productos
  orden.productos.forEach(p => {
    doc
      .fillColor('black')
      .fontSize(11)
      .text(p.producto_nombre || '-', 55, y)
      .text(p.cantidad, 215, y)
      .text(`$${parseFloat(p.precio).toFixed(2)}`, 310, y)
      .text(`$${parseFloat(p.subtotal).toFixed(2)}`, 430, y);

    y += itemSpacing;
  });

  // Línea final
  doc.moveTo(50, y).lineTo(550, y).stroke();

  // Total general
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(`TOTAL: $${parseFloat(orden.total).toFixed(2)}`, 400, y + 10, { align: 'right' });

  // Mensaje de cierre
  doc
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('GRACIAS POR ELEGIRNOS, VUELVA PRONTO!', 0, y + 60, { align: 'center' });

  // Finalizar el documento
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(stream.toBuffer());
    });
    stream.on('error', reject);
  });
};
