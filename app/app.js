const express = require('express');
const app = express();
const port = 3000

const PlacasController = require('./controllers/PlacasController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const PlacasMongoDao = require('./lib/projeto/PlacasMongoDao');
const PlacasDao = require('./lib/projeto/PlacasDao');
const Sequelize = require("sequelize");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { MongoClient } = require('mongodb');

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo`;
const mongoClient = new MongoClient(uri);

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('Verificação do JWT', jwt_payload);
    return done(null, jwt_payload);
}));

app.set('view engine', 'ejs');

let placasDao = new PlacasMongoDao(mongoClient);
let placasController = new PlacasController(placasDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(placasDao);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('Middleware 0');
    next();
});

app.use('/placas', placasController.getRouter());

app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('Middleware 1');
    next();
});

app.get(['/', '/index'], (req, res) => {
    console.log('Custom', req.dadosPersonalizados);
    placasController.index(req, res)
});

app.use((req, res, next) => {
    res.locals.dadosPersonalizados = { chave: 'valor' };
    console.log('Middleware 2');
    next();
});

app.get('/autor', (req, res) => {
    autorController.index(req, res);
});

app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({ 'usuario': req.user });
});

app.get('/login', (req, res) => {
    authController.index(req, res);
});

app.post('/logar', (req, res) => {
    authController.logar(req, res);
});

app.get('/lista', async (req, res) => {
    let placas = await placasDao.listar();
    res.render('lista', { placas });
});

app.get('*', (req, res, next) => {
    res.status(404).send('Não encontrado');
});

app.use(function (err, req, res, next) {
    console.error('Registrando erro:', err.stack);
    res.status(500).send('Erro no servidor: ' + err.message);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
