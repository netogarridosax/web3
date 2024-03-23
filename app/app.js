const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const passport = require('passport');
const mysql = require('mysql');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { MongoClient } = require("mongodb");

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo`;   
const mongoClient = new MongoClient(uri);

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt', jwt_payload);
    return done(null, jwt_payload);
}));

const PlacaMongoDao = require('./lib/projeto/PlacaMongoDao');
const PlacaController = require('./controllers/PlacaControllers');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const PlacasDao = require('./lib/projeto/PlacasDao');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bd',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let placaDao = new PlacaMongoDao(mongoClient);
let placaController = new PlacaController(placaDao);
let autorController = new AutorController();
let authController = new AuthController(placaDao);

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const requestInfo = `${currentDate} ${currentTime} - Rota: ${req.path}`;

  console.log(requestInfo);

  next();
});

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/placas', placaController.getRouter());

app.use((req, res, next) => {
  res.locals.dadosPersonalizados = { chave: 'valor' };
  console.log('middleware 0')
  next();
});

app.get('/', (req, res) => {
    console.log('custom', req.dadosPersonalizados); 
    placaController.index(req, res)
});

app.get('/index', (req, res) => res.render('index'));
app.post('/placas', (req, res) => placaController.area(req, res));

app.get('/autor', (req, res) => {
    autorController.index(req, res);
});

app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({'usuario': req.user});
})

app.get('/login', (req, res) => {
    authController.index(req, res);
});

app.post('/logar', (req, res) => {
    authController.logar(req, res);
});

app.get('/lista', async (req, res) => {
    let placas = await placaDao.listar();
    res.render('lista', {placas});
});

app.get('*', (req, res, next) => {
    res.status(404).send('Não encontrado')
});

app.use(function (err, req, res, next) {
    console.error('registrando erro:', err.stack)
    res.status(500).send('Erro no servidor: ' + err.message);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
