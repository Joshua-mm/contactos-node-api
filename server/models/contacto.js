const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let tiposPermitidos = {
    values: ['casa', 'movil', 'trabajo'],
    message: '{PATH} no es una opción valida'
};

let contactoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: false },
    telefono: { type: Number, required: [true, 'El número de telefono es necesario'] },
    tipo: { type: String, required: false, default: 'movil', enum: tiposPermitidos },
    direccion: { type: String, required: false },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: Boolean, default: true, required: true }
});

module.exports = mongoose.model('Contacto', contactoSchema);