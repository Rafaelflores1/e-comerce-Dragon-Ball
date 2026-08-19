// Creation and configuration of the Express APP
const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Servir la carpeta public/image desde el backend
app.use('/image', express.static(path.join(__dirname, '../uploads')));

// Route configuration
const productosRoutes = require('./routes/productos.routes');
app.use('/api/productos', productosRoutes);

const usuariosRoutes = require('./routes/usuarios.routes')
app.use('/api/usuarios', usuariosRoutes)

const categoriaRoutes = require('./routes/categorias.routes')
app.use('/api/categorias', categoriaRoutes);

const sagasRoutes = require('./routes/sagas.routes')
app.use('/api/sagas', sagasRoutes)

const pedidosRoutes = require('./routes/pedidos.routes')
app.use('/api/pedidos', pedidosRoutes)

const direccionesRoutes= require('./routes/direcciones.routes')
app.use('/api/direcciones', direccionesRoutes)
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

module.exports = app;