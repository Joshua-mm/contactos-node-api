const express = require('express');
const app = express();

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

// ############################################################
// Obtener todas las categoría de un usuario mediante su id
// ############################################################

app.get('/categorias', verificaToken, (req, res) => { //// Se pasará el Id del usuarios mediante los headers por seguridad. Sujeto a cambios

    let id = req.usuario._id;

    if (!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El usuario_id es necesario',
            }
        });
    }

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        Categoria.find({ usuario: usuarioDB._id })
            .exec((err, categorias) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    categorias
                });
            });
    });
});

// ############################################################
// Agregar categorias
// ############################################################

app.post('/categorias', verificaToken, (req, res) => {

    let id = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ############################################################
// Actualizar categoría
// ############################################################

app.put('/categorias/:id/:usuario_id', verificaToken, (req, res) => {

    let id = req.params.id;
    let usuario_id = req.params.usuario_id;
    let body = req.body;

    /// Verifica si viene un ID por el URL

    if (!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID de la categoría es necesario'
            }
        });
    }

    if (!usuario_id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID del usuario es necesario'
            }
        });
    }

    if (usuario_id != req.usuario._id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'No tienes ningúna categoría con ese ID'
            }
        });
    } else {
        console.log('si');
        var update = {
            nombre: body.nombre,
            descripcion: body.descripcion,
            usuario: usuario_id
        }
    }

    Categoria.findByIdAndUpdate(id, update, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ############################################################
// Borrar categoría
// ############################################################

app.delete('/categorias/:id/:usuario_id', verificaToken, (req, res) => {
    let id = req.params.id;
    let usuario_id = req.params.usuario_id;

    /// Nota: posible riesgo

    if (!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID de la categoría es necesario'
            }
        });
    }

    if (!usuario_id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'El ID del usuario es necesario'
            }
        });
    }

    if (usuario_id != req.usuario._id) {
        return res.status(400).json({
            ok: false,
            err: {
                messae: 'No tienes ninguna categoría con ese ID'
            }
        });
    }

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoriaDB === null) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;