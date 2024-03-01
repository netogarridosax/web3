const Placa = require("./placa");
const bcrypt = require('bcrypt');

class PlacasDao {
    constructor() {
        this.placas = [];
    }
    listar() {
        return this.placas;
    }

    inserir(placa) {
        this.validar(placa);
        this.placas.push(placa);
    }

    alterar(id, placa) {
        this.validar(placa);
        this.placas[id] = placa;
    }

    apagar(id) {
        this.placas.splice(id, 1);
    }

    validar(placa) {
        if (placa.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (placa.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }
    autenticar(nome, senha) {
        for (let placa of this.listar()) {
            if (placa.nome == nome && bcrypt.compareSync (senha, placa.senha)) {
                return placa;
            }
        }
        return null;
    }

}

module.exports = PlacasDao;
