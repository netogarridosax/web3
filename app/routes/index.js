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

router.get('/admin', (req, res) => {
    const messages = req.flash();
    res.render('admin', { messages });
});

router.get('/admin/create', (req, res) => res.render('criar_admin'));
router.get('/admin/login', (req, res) => adminController.showLoginForm(req, res));
router.post('/admin/login', (req, res) => adminController.login(req, res));
router.get('/admins', (req, res) => adminController.list(req, res)); 
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
