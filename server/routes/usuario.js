// Importar express
const express = require('express');
const app = express();

// Importar bcrypt para la encriptacion de una sola vía de la contraseña
const bcrypt = require('bcrypt');

// Importar modelo
const Usuario = require('../models/usuario');

// Rutas

// ##############################################
// Obtener todos los usuarios
// ##############################################

app.get('/usuario', (req, res) => {
    // ....
});

// ##############################################
// Obtener usuario mediante ID
// ##############################################

app.get('/usuario/:id', (req, res) => {
    // ....
});

// ##############################################
// Agregar usuario
// ##############################################

app.post('/usuario', (req, res) => {

});

// ##############################################
// Actualizar usuario
// ##############################################

app.put('/usuario/:id', (req, res) => {
    // ....
});

// ##############################################
// Desactivar usuario
// ##############################################

app.delete('/usuario/:id', (req, res) => {
    // ....
});

// Exportar app - express
module.exports = app;