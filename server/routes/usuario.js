// Importar express
const express = require('express');
const app = express();

// Rutas
app.get('/usuario', (req, res) => {
    res.json({
        ok: true,
        usuario: {
            nombre: 'Joshua'
        }
    });
});

// Exportar app - express
module.exports = app;