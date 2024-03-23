const Usuario = require('./../lib/projeto/usuario');
const utils = require('../lib/utils');

class UsuariosController {
    constructor(usuariosDao) {
        this.usuariosDao = usuariosDao;
    }
    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }

    async calcularArea(req, res){               
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
            let pentagono = new Pentagono();
            Pentagono.nome = query.nome;
            pentagono.lado = parseFloat(query.lado);
                       
            utils.renderizarEjs(res, './views/pentagono.ejs', pentagono);
        })
    }

     listar(req, res) {
        let usuarios = this.usuariosDao.listar();

        let dados = usuarios.map(usuario => {
            return {
                ...usuario
            };
        })

        utils.renderizarJSON(res, dados);
    }
    
    async inserir(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        try {
            usuario.id = await this.usuariosDao.inserir(usuario);
            utils.renderizarJSON(res, {
                usuario: {
                    ...usuario
                },
                mensagem: 'mensagem_usuario_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.usuariosDao.alterar(id, usuario);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_usuario_alterado'
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
        this.usuariosDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_usuario_apagado',
            id: id
        });
    }

    async getUsuarioDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        let usuario = new Usuario(
            corpo.nome,
            corpo.senha,
            corpo.papel
        );
        return usuario;
    }
}

module.exports = UsuariosController;