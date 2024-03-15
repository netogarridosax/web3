const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const router = require('./routes/index');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'chave secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.session.messages;
    delete req.session.messages;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}] ${req.method} to ${req.url}`);
    next();
});

app.use('/', router);

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
