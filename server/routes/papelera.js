const express = require('express');
const app = express();

const Contacto = require('../models/contacto');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');

const { verificaToken } = require('../middlewares/autenticacion');

// ------------------------------------------
// Obtener todos los elementos de la papelera
// ------------------------------------------

app.get('/papelera', verificaToken, (req, res) => {

    let usuario_id = req.usuario._id;

    Contacto.find({ estado: false, usuario: usuario_id })
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, contactos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (contactos.length === 0) {
                return res.json({
                    ok: true,
                    message: 'Tu papelera está vacia'
                });
            }


            Contacto.count({ estado: false, usuario: usuario_id }, (err, conteo) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    message: `Tu papelera contiene ${ conteo } contactos`,
                    contactos
                });
            });
        });
});

// --------------------------------------------------
// Eliminar de la papelera un contacto (estado: true)
// --------------------------------------------------

app.put('/papelera/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let usuario_id = req.usuario._id;

    if (!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID de la categoría es necesario'
            }
        });
    }

    let update = {
        estado: true
    };

    Contacto.findByIdAndUpdate(id, update, { new: true }, (err, contacto) => {

        if (contacto.usuario != usuario_id) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No tienes ningun contacto con ese ID'
                }
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Tu contacto ha sido restablecido',
            contacto
        });
    });
});

// ----------------------------------
// Eliminar contacto definitivamente
// ----------------------------------

app.delete('/papelera/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let usuario_id = req.usuario._id;

    if (!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID de la categoría es necesario'
            }
        });
    }

    Contacto.findOneAndRemove({ _id: id, estado: false }, (err, contacto) => {

        if (!contacto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El contacto no existe'
                }
            });
        }

        if (contacto.usuario != usuario_id) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No tienes ninguna categoría con ese ID'
                }
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            contacto
        });
    });
});

module.exports = app;