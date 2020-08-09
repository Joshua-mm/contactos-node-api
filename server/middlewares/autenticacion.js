const jwt = require('jsonwebtoken');

// ############################
// Verificar token
// ############################

let verificaToken = (req, res, next) => {

    let token = req.get('token'); /// Header

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

// ############################
// Verificar ADMIN_ROLE
// ############################

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes permiso para acceder a esta función'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole
}