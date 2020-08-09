// Implementación de express
const express = require('express');
const app = express();

// Implementacion path
const path = require('path');
const publicPath = path.resolve(__dirname, '../public');

// Configs
require('./config/config');

/// Public
app.use(express.static(publicPath));

// Rutas

app.use(require('./routes/usuario'));

/// Servidor

app.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Corriendo servidor en el puerto ${ process.env.PORT }`);
});