const Placa = require('../lib/placa/Placa');

class PlacaController {
    constructor(placaDao) {
        this.Placa = placaDao;
    }

    async create(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async list(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async editar(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async update(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async delete(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async getById(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

    }

    async index(req, res) {
        res.render('index');
    }

    getRouter() {
        const express = require('express');
        const router = express.Router();

        router.get('/', this.list.bind(this));
        router.get('/editar/:id', this.editar.bind(this));
        router.post('/editar/:id', this.update.bind(this));
        router.get('/delete/:id', this.delete.bind(this));
        router.get('/:id', this.getById.bind(this));

        return router;
    }
}

module.exports = PlacaController;
