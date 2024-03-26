const utils = require('../lib/utils');
const Placa = require('./../lib/projeto/placa');
const express = require('express');

class PlacasController {
    constructor(placasDao) {
        this.placasDao = placasDao;
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', (req, res) => {
            this.listar(req, res)
        });

        rotas.put('/:id', (req, res) => {
            this.alterar(req, res);
        })
        rotas.delete('/:id', (req, res) => {
            this.apagar(req, res);
        })

        rotas.post('/', (req, res, next) => {
            this.inserir(req, res, next);
        })
        return rotas;
    }

    index(req, res) {
        res.render('index');
    }

    area(req, res) {
        let corpoTexto = '';
        let i = 0;
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
            console.log(i++, corpoTexto);
        });
        req.on('end', () => {
            let query = utils.decoficarUrl(corpoTexto);

            console.log(query);
            let placa = new Placa();
            placa.nome = query.nome;
            placa.lado = parseFloat(query.lado);

            if (req.headers.accept == 'application/json') {
                utils.renderizarJSON(res, placa);
            }
            else {
                utils.renderizarEjs(res, './views/placa.ejs', placa);
            }
        })
    }

    async listar(req, res) {
        try {
            let placas = await this.placasDao.listar();
            let dados = placas.map(placa => {
                return {
                    ...placa,
                    media: placa.media(),
                    estaAprovado: placa.estaAprovado()
                };
            });
            res.json(dados);
        } catch (error) {
            console.error('Erro ao listar:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de placas' });
        }
    }

    async inserir(req, res, next) {
        try {
            let placa = await this.getPlacaDaRequisicao(req);
            placa.id = await this.placasDao.inserir(placa);
            res.json({
                placa: {
                    ...placa,
                    area: placa.area(),
                },
                mensagem: 'mensagem_placa_cadastrado'
            });
        } catch (error) {
            console.error('Erro ao inserir placa:', error);
            next(error);
        }
    }

    async alterar(req, res) {
        try {
            let placa = await this.getPlacaDaRequisicao(req);
            let id = req.params.id;
            await this.placasDao.alterar(id, placa);
            utils.renderizarJSON(res, { mensagem: 'mensagem_placa_alterado' });
        } catch (error) {
            console.error('Erro ao alterar placa:', error);
            utils.renderizarJSON(res, { error: error.message }, 400);
        }
    }

    async apagar(req, res) {
        try {
            let id = req.params.id;
            await this.placasDao.apagar(id);
            res.json({ mensagem: 'mensagem_placa_apagado', id: id });
        } catch (error) {
            console.error('Erro ao apagar placa:', error);
            res.status(500).json({ error: 'Erro ao apagar a placa' });
        }
    }

    async getPlacaDaRequisicao(req) {
        let corpo = req.body;
        let placa = Placa.build({
            nome: corpo.nome,
            placa: parseFloat(corpo.lado),
            senha: corpo.senha,
            papel: corpo.id_papel
        });
        return placa;
    }
}

module.exports = PlacasController;
