const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');

const PlacaController = require('./controllers/PlacaControllers');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const UsuariosController = require('./controllers/UsuariosControllers');
const PlacasDao = require('./lib/projeto/PlacasDao');
const UsuariosDao = require('./lib/projeto/UsuariosDao');
const PlacasMysqlDao = require('./lib/projeto/PlacasMysqlDao');
const UsuariosMysqlDao = require('./lib/projeto/UsuariosMysqlDao');

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

let placasDao = new PlacasDao();
let usuariosDao = new UsuariosDao();
let placaController = new PlacaController(placasDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

app.get('/index', (req, res) => {
    placaController.index(req, res);
});

app.get('/area', (req, res) => {
    placaController.area(req, res);
});

app.get('/placas', (req, res) => {
    authController.autorizar(req, res, () => {
        placaController.listar(req, res);
    }, ['admin', 'geral']);
});

app.post('/placas', (req, res) => {
    authController.autorizar(req, res, () => {
        placaController.inserir(req, res);
    }, ['admin', 'geral']);
});

app.put('/placas', (req, res) => {
    authController.autorizar(req, res, () => {
        placaController.alterar(req, res);
    }, ['admin', 'geral']);
});

app.delete('/placas', (req, res) => {
    authController.autorizar(req, res, () => {
        placaController.apagar(req, res);
    }, ['admin']);
});

app.get('/usuarios', (req, res) => {
    usuariosController.listar(req, res);
});

app.post('/usuarios', (req, res) => {
    usuariosController.inserir(req, res);
});

app.put('/usuarios', (req, res) => {
    authController.autorizar(req, res, () => {
        usuariosController.alterar(req, res);
    }, ['admin', 'geral']);
});

app.delete('/usuarios', (req, res) => {
    authController.autorizar(req, res, () => {
        usuariosController.apagar(req, res);
    }, ['admin']);
});

app.get('/autor', (req, res) => {
    autorController.autor(req, res);
});

app.get('/login', (req, res) => {
    authController.index(req, res);
});

app.post('/logar', (req, res) => {
    authController.logar(req, res);
});

app.use((req, res) => {
    estaticoController.procurar(req, res);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// TESTE COMMIT
