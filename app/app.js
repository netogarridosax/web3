const express = require('express');
const app = express();
const PORT = 3000;

const PlacaController = require('./controllers/PlacaController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const PlacaSequelizeDao = require('./lib/placa/PlacaSequelizeDao');
const PlacaDao = require('./lib/placa/PlacaDao');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const passport = require('passport');


const sequelize = new Sequelize(
  process.env.MARIADB_DATABASE,
  'root',
  process.env.MARIADB_PASSWORD,
  {
    host: 'bd',
    dialect: 'mysql'
  }
);

app.set('view engine', 'ejs');

let placaDao = new PlacaSequelizeDao(sequelize);
let placaController = new PlacaController(placaDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();

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

app.get([
  '/',
  '/index'
  ], (req, res) => {
      console.log('custom', req.dadosPersonalizados); 
      placaController.index(req, res)
});

app.get('/index', (req, res) => res.render('index'));
app.post('/placas', (req, res) => placaController.area(req, res));
app.get('/autor', (req, res) => autorController.autor(req, res));


app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});