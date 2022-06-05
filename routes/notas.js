const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { post } = require("./categorias");
require('../models/Notas');
const Notas = mongoose.model('notas');
require('../models/Categoria');
const Categoria = mongoose.model('categorias')
require('../models/tags');
const Tags = mongoose.model('tags')
const moment = require('moment');
moment.locale('pt-br');


router.get('/', async (req, res) => {
    const query = {};
    if (req.query.categoria) {
        const categoria = await Categoria.find({ slug: req.query.categoria }).lean();
        if (categoria) {
            query['categoria'] = categoria[0]._id.toString();
        }
    }
    if (req.query.tag) {
        const tag = await Tags.find({ slug: req.query.tag }).lean();
        if (tag) {
            query['tags'] = tag[0]._id.toString();
        }
    }
    Notas.find(query).lean().populate(["categoria", "tags"]).sort({ data: 'desc' }).then((notas) => {
        notas.forEach(nota => {
            nota.conteudo = nota.conteudo.substring(0, 100) + '...';
            nota.data = moment(nota.data).format('LL')
        })
        res.render('notas/listar', { notas });
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao listar as notas');
        res.redirect('/');
    });
});


//Criação de novas Notas

router.get('/nova', async (req, res) => {
    const categorias = await Categoria.find().lean();
    const tags = await Tags.find().lean();
    res.render("notas/criar", {
        tags, categorias
    })
});

router.get('/:id', (req, res) => {
    Notas.findOne({ _id: req.params.id }).lean().populate(["categoria", "tags"]).then((nota) => {
        if (nota) {
            nota.data = moment(nota.data).format('LL');
            res.render('notas/show', { nota })
        } else {
            req.flash('error_msg', 'houve um erro ao encontrar a nota')
        }
    })

})


router.post('/', async (req, res) => {

    var erros = [];

    if (req.body.categoria === '0') {
        erros.push({ texto: 'Categoria inválida, registre uma categoria.' });
    };

    if (erros.length > 0) {
        res.render('notas/criar', { erros: erros });
    } else {
        const novaNotas = {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            tags: req.body.tags
        }
        new Notas(novaNotas).save().then(() => {
            req.flash('success_msg', 'A nota foi salva.');
            res.redirect('/notas');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro durante o salvamento das notas');
            res.redirect('notas/criar')
        });
    };
});

// Edição de notas

router.get('/:id/editar', async (req, res) => {
    const categorias = await Categoria.find().lean();
    const tags = await Tags.find().lean();
    const nota = await Notas.findById(req.params.id).lean();
    if (nota) {
        nota.categoria = nota.categoria.toString();
        nota.tags = nota.tags.map(tag => tag.toString())
    }
    if (categorias && categorias.length) {
        categorias.forEach(cat => {
            cat._id = cat._id.toString();
            cat.selected = nota.categoria === cat._id;
        })
    }
    if (tags && tags.length && nota.tags && nota.tags.length) {
        tags.forEach(tag => tag.checked = nota.tags.includes(tag._id.toString()))
    }
    res.render("notas/editar", {
        tags, categorias, nota
    })
})

router.post('/:id/editar', async (req, res) => {
    var erros = [];

    if (req.body.categoria === '0') {
        erros.push({ texto: 'Categoria inválida, registre uma categoria.' });
    };

    if (erros.length > 0) {
        req.flash('error_msg', 'Houve um erro ao editar a nota');
        res.redirect(`/notas/${req.params.id}/editar`)
    } else {
        try {
            const { titulo, conteudo, categoria, tags } = req.body;
            const nota = await Notas.findOne({ _id: req.params.id });
            nota.titulo = titulo;
            nota.conteudo = conteudo;
            nota.categoria = categoria;
            nota.tags = tags;
            await nota.save();
            req.flash('success_msg', 'A nota foi salva.');
            res.redirect('/notas');
        } catch (erro) {
            console.log(erro)
            req.flash('error_msg', 'Houve um erro durante o salvamento das notas');
            res.redirect(`/notas/${req.params.id}/editar`)
        }
    };
});

//Excluir Notas

router.get('/:id/deletar', (req, res) => {
    Notas.findOneAndDelete({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Nota deletada com sucesso.');
        res.redirect('/notas')
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao excluir a nota')
        res.redirect('/notas')
    });
});

module.exports = router