const utils = require('../lib/utils.js');
const express = require('express');

class PlacaController {
    constructor(placaDao) {
        this.placaDao = placaDao;
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', (req, res) => {
            this.listar(req, res);
        });

        rotas.put('/:id', async (req, res) => {
            await this.alterar(req, res);
        });

        rotas.delete('/:id', async (req, res) => {
            await this.apagar(req, res);
        });

        rotas.post('/', async (req, res, next) => {
            await this.inserir(req, res, next);
        });

        return rotas;
    }

    index(req, res) {
        res.render('index');
    }

    async area(req, res) {
        try {
            const { nome, lado } = req.body;

            const placa = await this.placaDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                placa: {
                    ...placa.dataValues,
                    area: placa.calcularArea(),
                },
                mensagem: 'mensagem_placa_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao processar área:', error);
            res.status(400).json({ mensagem: 'Erro ao processar área.' });
        }
    }

    async listar(req, res) {
        try {
            let placas = await this.placaDao.listar();
            let dados = placas.map(placa => ({
                ...placa.dataValues,
                area: placa.calcularArea(),
            }));

            res.json(dados);
        } catch (error) {
            res.status(500).json({
                mensagem: `Erro ao listar placas: ${error.message}`,
            });
        }
    }

    async inserir(req, res, next) {
        try {
            const { nome, lado } = req.body;

            const placa = await this.placaDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                placa: {
                    ...placa.dataValues,
                    area: placa.calcularArea(),
                },
                mensagem: 'mensagem_placa_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao inserir placa:', error);
            res.status(400).json({ mensagem: 'Erro ao inserir placa.' });
            // Se você estiver usando middleware de erro global, você pode remover o next()
            // next(error);
        }
    }

    async alterar(req, res) {
        try {
            const { id } = req.params;
            const { nome, lado } = req.body;

            await this.placaDao.alterar(id, {
                nome,
                lado: parseFloat(lado),
            });

            res.json({ mensagem: 'mensagem_placa_alterado' });
        } catch (error) {
            console.error('Erro ao alterar placa:', error);
            res.status(400).json({ mensagem: 'Erro ao alterar placa.' });
        }
    }

    async apagar(req, res) {
        try {
            const { id } = req.params;

            await this.placaDao.apagar(id);

            res.json({ mensagem: 'mensagem_placa_apagado', id });
        } catch (error) {
            console.error('Erro ao apagar placa:', error);
            res.status(400).json({ mensagem: 'Erro ao apagar placa.' });
        }
    }
}

module.exports = PlacaController;