const express = require('express');
const app = express();

const Contacto = require('../models/contacto');
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//##############################
// Obtener todos los contactos
//##############################
app.get('/contactos', [verificaToken, verificaAdminRole], (req, res) => {

    let from = req.query.from;
    let until = req.query.until;

    from = Number(from);
    until = Number(until);

    Contacto.find({ estado: true })
        .skip(from)
        .limit(until)
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
                    message: 'No hay ningún contacto para mostrar'
                });
            }

            res.json({
                ok: true,
                contactos
            });
        });
});

// ------------------------------------
// Obtener los contactos de un usuario
// -------------------------------------

app.get('/contacto', verificaToken, (req, res) => {
    let usuario_id = req.usuario._id;

    Contacto.find({ usuario: usuario_id })
        .exec((err, contactos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (contactos.length === 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'No hay ningún contacto para mostrar'
                });
            }

            Usuario.findById(usuario_id, (err, usuario) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuario,
                    contactos
                });
            });

        });
});

// ------------------------------------
// Agregar un nuevo contacto
// ------------------------------------

app.post('/contacto', verificaToken, (req, res) => {

    let usuario_id = req.usuario._id;
    let body = req.body;

    let contacto = new Contacto({
        nombre: body.nombre,
        apellido: body.apellidos,
        telefono: body.telefono,
        tipo: body.tipo,
        direccion: body.direccion,
        categoria: body.categoria,
        usuario: usuario_id
    });

    Usuario.findById(usuario_id, (err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        contacto.save((err, contacto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario,
                contacto
            });
        });
    });
});

app.put('/contacto/:id', verificaToken, (req, res) => {

    let usuario_id = req.usuario._id;
    let id = req.params.id;
    let body = req.body;

    if (!id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID de la categoría es necesario'
            }
        });
    }

    let update = {
        nombre: body.nombre,
        apellido: body.apellidos,
        telefono: body.telefono,
        tipo: body.tipo,
        direccion: body.direccion,
        categoria: body.categoria,
        usuario: usuario_id,
        estado: body.estado
    }

    Contacto.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, contacto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.findById(usuario_id, (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario,
                contacto
            });
        });
    });
});

app.delete('/contacto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let usuario_id = req.usuario._id;

    let update = {
        estado: false
    };

    Contacto.findById(id, (err, contacto) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!contacto.estado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El contacto que deseas borrar ya está en tu papelera'
                }
            });
        }

        Contacto.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, contactoBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                message: 'El contacto ahora está en tu papelera',
                contactoBorrado
            });
        });
    });

});

module.exports = app;