require('dotenv').config();
console.log('🚀  Levantando ▶ src/server.js');
const { app, PORT } = require('./app');
app.listen(PORT, () => {
  console.log(`   ✅ Escuchando en http://localhost:${PORT}`);
});
