const AutorController = require('../controllers/AutorController');
const express = require('express');
const router = express.Router();
const Placa = require('../lib/Placa');
const PlacaController = require('../controllers/PlacaController');
const AdminController = require('../controllers/AdminController');

const adminController = new AdminController();
const autorController = new AutorController();
const placaController = new PlacaController();

router.get('/placas/editar/:id', (req, res) => {
    const { id } = req.params;
    placaController.editar(req, res);
});

router.get('/Admin', (req, res) => {
    const messages = req.flash();
    res.render('Admin', { messages });
});

router.get('/Admin/create', (req, res) => res.render('criar_Admin'));
router.get('/Admin/login', (req, res) => AdminController.showLoginForm(req, res));
router.post('/Admin/login', (req, res) => AdminController.login(req, res));
router.get('/Admins', (req, res) => AdminController.list(req, res)); 
router.post('/placas', (req, res) => placaController.create(req, res));
router.get('/placas', (req, res) => placaController.list(req, res));
router.put('/placas/:id', (req, res) => placaController.update(req, res));
router.delete('/placas/:id', (req, res) => placaController.delete(req, res));
router.get('/placas/:id', (req, res) => placaController.getById(req, res));
router.get('/', (req, res) => res.render('index'));
router.get('/index', (req, res) => res.redirect('/'));
router.get('/autor', (req, res) => autorController.index(req, res));
router.post('/resposta', (req, res) => {
    const { nome, lado, id } = req.body;
    const placa = new Placa(nome, lado, id);
    res.render('resposta', { area: placa.area() });
});

module.exports = router;
