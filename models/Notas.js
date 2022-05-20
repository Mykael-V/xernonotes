const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notas = new Schema({
    titulo: {
        type: String,
        required: true
    },

    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tags',
        required: false
    }],
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('notas', Notas);