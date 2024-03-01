const Placa = require('./../lib/projeto/placa');
const utils = require('../lib/utils');

class PlacasController {
    constructor(placasDao) {
        this.placasDao = placasDao;
    }
    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');      
    }
    area(req, res){               
        let corpoTexto ='';
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
        });
        req.on('end', () => {
            let propriedades = corpoTexto.split('&');
            let query = {};
            for (let propriedade of propriedades) {
                let [variavel, valor] = propriedade.split('=');
                query[variavel] = valor;
            }
            let placa = new Placa();
            placa.nome = query.nome;
            placa.lado = parseFloat(query.lado);        
            utils.renderizarEjs(res, './views/area.ejs', placa);
        })
    }

    async listar(req, res) {
        let placas = this.placasDao.listar();
        let dados = placas.map(placa => {
            return {
                ...placa,
                area: placa.area(),
            };
        })

        utils.renderizarJSON(res, dados);
    }
    
    async inserir(req, res) {
        let placa = await this.getPlacaDaRequisicao(req);
        try {
            this.placasDao.inserir(placa);
            utils.renderizarJSON(res, {
                placa: {
                    ...placa,
                    area: placa.area(),
                },
                mensagem: 'mensagem_placa_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let placa = await this.getPlacaDaRequisicao(req);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.placasDao.alterar(id, placa);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_placa_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        this.placasDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_placa_apagado',
            id: id
        });
    }

    async getPlacaDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        let placa = new Placa(
            corpo.nome,
            parseFloat(corpo.lado),
            corpo.papel
        );
        return placa;
    }
}

module.exports = PlacasController;