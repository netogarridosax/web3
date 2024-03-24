const utils = require('../lib/utils');
const express = require('express');

class PlacasControler {
    constructor(placasDao) {
        this.placasDao = placasDao;
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

            const pentagono = await this.placasDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                placa: {
                    ...pentagono.dataValues,
                    area: pentagono.area(),
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
            console.log('Entrando na função listar');
            let placas = await this.placasDao.listar();
            console.log('Placas:', placas);

            let dados = placas.map(placa => ({
                id: placa._id,
                nome: placa.nome,
                lado: placa.lado,
            }));

            res.json(dados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao listar placas' });
        }
    }

    async inserir(req, res, next) {
        try {
            const { nome, lado } = req.body;

            const placa = await this.placasDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                placa: {
                    ...placa.dataValues,
                    area: placa.area(),
                },
                mensagem: 'mensagem_placa_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao inserir placa:', error);
            res.status(400).json({ mensagem: 'Erro ao inserir placa.' });
        }
    }

    async alterar(req, res) {
        try {
            const { id } = req.params;
            const { nome, lado } = req.body;

            await this.placasDao.alterar(id, {
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

            await this.placasDao.apagar(id);

            res.json({ mensagem: 'mensagem_placa_apagado', id });
        } catch (error) {
            console.error('Erro ao apagar placa:', error);
            res.status(400).json({ mensagem: 'Erro ao apagar placa.' });
        }
    }
}

module.exports = PlacasControler;
