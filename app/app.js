const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Importar os controladores
const PlacaController = require('./controllers/PlacaController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');

// Importar DAOs e outros módulos necessários
const PlacaSequelizeDao = require('./lib/placa/PlacaSequelizeDao');

// Configuração do Passport.js
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt' , jwt_payload);
    return done(null, jwt_payload);
}));

// Configuração do Sequelize
const sequelize = new Sequelize(
  process.env.MARIADB_DATABASE,
  'root',
  process.env.MARIADB_PASSWORD,
  {
    host: 'bd',
    dialect: 'mysql'
  }
);

// Setar a view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Instanciar controladores e outros módulos
let placaDao = new PlacaSequelizeDao(sequelize);
let placaController = new PlacaController(placaDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(placaDao);

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para registrar informações de solicitação
app.use((req, res, next) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const requestInfo = `${currentDate} ${currentTime} - Rota: ${req.path}`;
  console.log(requestInfo);
  next();
});

// Rotas
app.use('/placas', placaController.getRouter());

app.use((req, res, next) => {
  res.locals.dadosPersonalizados = { chave: 'valor' };
  console.log('middleware 0');
  next();
});

// Rotas para autenticação
app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({'usuario': req.user});
});

app.get('/login', (req, res) => {
  authController.index(req, res);
});

app.post('/logar', (req, res) => {
  authController.logar(req, res);
});

// Rotas para outras funcionalidades
app.get(['/', '/index'], (req, res) => {
  console.log('custom', req.dadosPersonalizados); 
  placaController.index(req, res);
});

app.get('/index', (req, res) => res.render('index'));

app.post('/placas', (req, res) => placaController.area(req, res));

app.get('/autor', (req, res) => autorController.index(req, res));

// Middleware para lidar com rotas não correspondidas
app.use((req, res, next) => {
  res.status(404).send('Não encontrado');
});

// Middleware para lidar com erros
app.use(function (err, req, res, next) {
  console.error('Registrando erro: ', err.stack);
  res.status(500).send('Erro no servidor: ' + err.message);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
