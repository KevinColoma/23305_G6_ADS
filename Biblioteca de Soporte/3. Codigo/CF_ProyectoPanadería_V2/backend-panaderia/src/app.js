console.log('🛠️  Cargando ▶ src/app.js');
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { PORT } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const catRoutes  = require('./routes/categorias.routes');
const prodRoutes = require('./routes/productos.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const ordenRoutes = require('./routes/orden.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─────── Middleware de logging ───────
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`, 'body=', req.body);
  next();
});

// tras app.use(cors(...)) y app.use(express.json())
app.get('/', (req, res) => {
  res.send('✅ Servidor funcionando en el puerto ' + PORT); 
});

// Sanity‐check ping
app.post('/ping', (req, res) => {
  console.log('🔖 [ping] body:', req.body);
  res.json({ pong: true, recibimos: req.body });
});


app.use('/auth',       authRoutes);
app.use('/usuarios',   userRoutes);
app.use('/categorias', catRoutes);
app.use('/productos',  prodRoutes);
app.use('/ordenes', ordenRoutes);

app.use(errorHandler);

module.exports = { app, PORT };