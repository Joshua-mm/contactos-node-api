// Implementación de express
const express = require('express');
const app = express();

// Base de datos
const mongoose = require('mongoose');

// Implementacion path
const path = require('path');
const publicPath = path.resolve(__dirname, '../public');

// Configs
require('./config/config');

/// Public
app.use(express.static(publicPath));

// Rutas

app.use(require('./routes/usuario'));

// Conexión a la base de datos

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos funcionando !');
});

/// Servidor

app.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Corriendo servidor en el puerto ${ process.env.PORT }`);
});