const nodemailer = require('nodemailer');

// Transportador de correo usando cuenta temporal de Ethereal
const crearTransportador = async () => {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Envía el correo con PDF adjunto
 * @param {string} destinatario - Correo del cliente
 * @param {Buffer} pdfBuffer - Contenido del PDF
 */
exports.enviarOrden = async (destinatario, pdfBuffer) => {

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mcoco6644@gmail.com',
    pass: 'wzzw bprx cffp jqsf'
  }
});


  const info = await transporter.sendMail({
    from: '"Panadería La Italiana" <panaderia@gmail.com>',
    to: destinatario,
    subject: 'ORDEN DE PEDIDO - Panadería La Italiana',
    text: 'Adjunto encontrarás tu orden de pedido. ¡Gracias por elegirnos!',
    html: `<p><strong>Adjunto encontrarás tu orden de pedido.</strong></p><p style="color:green;">GRACIAS POR ELEGIRNOS, ¡VUELVA PRONTO!</p>`,
    attachments: [
      {
        filename: 'orden.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('📧 Correo enviado:', info.messageId);
  console.log('🔗 Vista previa (solo dev):', nodemailer.getTestMessageUrl(info));
};
