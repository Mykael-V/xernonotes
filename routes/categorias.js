const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');





//CRUD CATEGORIAS



//Rota de listagem de categorias
router.get('/', (req, res) => {
    Categoria.find().lean().sort({ date: 'desc' }).then((categorias) => {
        res.render('categorias/crud', { categorias: categorias });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias');
        res.redirect('/');
    });
});


//Rota de criação de categoria

router.get('/nova', (req, res) => {
    res.render('categorias/criar')
});


//Post de criação de categorias 

router.post('/', (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        erros.push({ texto: 'Nome inválido.' });
    };

    if (!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null) {
        erros.push({ texto: 'Slug inválido.' })
    };

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da categoria é muito pequeno.' })
    };

    if (erros.length > 0) {
        res.render('categorias/criar', {
            erros: erros
        });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso.');
            res.redirect('/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria.');
            res.redirect('/categorias/nova');
        });
    };

});



//Rota para edição de categorias 

router.get('/:id/editar', async (req, res) => {
    try {

        const categoria = await Categoria.findOne({ _id: req.params.id }).lean()
        console.log(categoria)
        res.render('categorias/editar', { categoria });
    } catch (err) {
        req.flash('error_msg', 'Houve um erro ao carregar a categoria');
        req.redirect("/categorias");

    };
});



//Post pra excluir e editar.Vi uma coisa parecida no curso que tô fazendo e decidi tentar. Achei legal , poupa linhas .

router.post('/:id', async (req, res) => {
    try {

        var erros = [];

        if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
            erros.push({ texto: 'Nome inválido.' });
        };

        if (!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null) {
            erros.push({ texto: 'Slug inválido.' })
        };

        if (req.body.nome.length < 2) {
            erros.push({ texto: 'Nome da categoria é muito pequeno.' })
        };

        if (erros.length > 0) {
            res.render('categorias/editar', {
                erros: erros
            });
        } else {
            const categoria = await Categoria.findOne({ _id: req.params.id })
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            await categoria.save()
            req.flash('success_msg', 'Categoria criada com sucesso.');
        };

        res.redirect('/categorias')
    } catch (err) {
        req.flash('error_msg', 'Houve um erro ao salvar a categoria.');
        res.redirect('/categorias/nova');

    }


})

router.get('/:id/deletar', async (req, res) => {
    try {
        await Categoria.findOneAndDelete({ _id: req.params.id })
        req.flash('success_msg', 'Categoria excluida com sucesso')
    } catch (err) {
        req.flash('error_msg', 'Erro ao excluir categoria')
    } finally {
        res.redirect('/categorias')
    }

})







module.exports = router
