const mongoose = require('mongoose');

let Schema = mongoose.Schema;

categoriaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Categoria', categoriaSchema);