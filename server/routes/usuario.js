// Importar express
const express = require('express');
const app = express();

// Importar bcrypt para la encriptacion de una sola vía de la contraseña
const bcrypt = require('bcrypt');

// Importar modelo
const Usuario = require('../models/usuario');

/// Importar underscore para actualizar ciertos campos de la base de datos
const _ = require('underscore');

/// Importar middlewares
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// Rutas

// ##############################################
// Obtener todos los usuarios - Done
// ##############################################

app.get('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    desde = Number(desde);
    hasta = Number(hasta);

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
});

// ##############################################
// Obtener usuario mediante ID - Done
// ##############################################

app.get('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// ##############################################
// Agregar usuario - Done
// ##############################################

app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// ##############################################
// Actualizar usuario - Done
// ##############################################

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let update = _.pick(body, ['nombre', 'email', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// ##############################################
// Desactivar usuario - Done
// ##############################################

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let update = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, update, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Exportar app - express
module.exports = app;