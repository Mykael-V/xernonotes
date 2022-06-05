const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require("./categorias");
require('../models/tags')
const Tags = mongoose.model('tags')



//Rota de listar tags


router.get('/', (req, res) => {
    Tags.find().lean().sort({ date: 'desc' }).then((tags) => {
        res.render('tags/listar', { tags });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as tags');
        res.redirect('/');
    });
});







//Rota de Criar tags
router.get('/criar', (req, res) => {
    res.render('tags/criar')
})



//POST criar tags


router.post('/', async (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        erros.push({ texto: 'Nome inválido.' });
    };

    if (!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null) {
        erros.push({ texto: 'Slug inválido.' })
    };

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da tag é muito pequeno.' })
    };

    if (erros.length > 0) {
        res.render('tags/criar', {
            erros: erros
        });
    } else {
        const novaTag = {
            nome: req.body.nome,
            slug: req.body.slug
        };
        new Tags(novaTag).save().then(() => {
            req.flash('success_msg', 'Tag criada com sucesso.');
            res.redirect('/tags');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a tag.');
            res.redirect('/tags/criar');
        });
    };

})

//router.post



//Rota de excluir



router.get('/:id/deletar', async (req, res) => {
    try {
        await Tags.findOneAndDelete({ _id: req.params.id })
        req.flash('success_msg', 'tag excluida com sucesso')
    } catch (err) {
        req.flash('error_msg', 'Erro ao excluir tag')
    } finally {
        res.redirect('/tags')
    }

})


module.exports = router









