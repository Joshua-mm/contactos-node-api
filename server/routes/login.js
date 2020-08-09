const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El [correo] y/o la contraseña son incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.contra, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El correo y/o la [contraseña] son incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;