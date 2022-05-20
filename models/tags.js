const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Tags = new Schema({
    nome: {
        type: String,
        required: true,
        default: 'undefined'
    },
    slug: {
        type: String,
        required: true,
        default: 'undefined'
    },
});

mongoose.model('tags', Tags);