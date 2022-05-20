const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const categorias = require('./routes/categorias')
const tags = require('./routes/tags')
const notas = require('./routes/notas')
// const hbs = require('express-handlebars');
const hbshelpers = require('handlebars-helpers');
const multihelpers = hbshelpers();

//Configurações
app.use(session({
    secret: 'xernonotes',
    resave: true,
    saveUninitialized: true
}));
app.use(flash())
//Midleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    next();
});
//Handlebars
app.engine(
    "hbs",
    handlebars.engine({
        helpers: multihelpers,
        partialsDir: ["views/partials"],
        extname: ".hbs",
        layoutsDir: "views",
        defaultLayout: "layouts/main"
    })
);
app.set('view engine', 'hbs');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/xernonotes2").then(() => {
    console.log("Conectado ao banco de dados")
}).catch((err) => {
    console.log("eroo ao se conectar " + err)
});

//Public
app.use(express.static(path.join(__dirname + "/public")));
// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROTAS
//Home
app.get("/", (req, res) => {
    res.redirect("/notas")
});
//Importação das rotas
app.use('/categorias', categorias);
app.use('/tags', tags);
app.use('/notas', notas)



//Outras coisas
const PORT = 5050
app.listen(PORT, () => {
    console.log("Servidor ONline")
})