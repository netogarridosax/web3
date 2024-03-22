const Placa = require("./Placa");
const bcrypt = require('bcrypt');

class PlacaDao {
    constructor() {
        this.octogonais = [];
    }

    listar() {
        return this.octogonais;
    }

    inserir(placa) {
        this.validar(placa);
        placa.senha = bcrypt.hashSync(placa.senha, 10);
        this.octogonais.push(placa);
    }

    alterar(id, placa) {
        this.validar(placa);
        this.octogonais[id] = placa;
    }

    apagar(id) {
        this.octogonais.splice(id, 1);
    }

    validar(placa) {
        if (placa.nome === '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (placa.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }

    autenticar(nome, senha) {
        for (let placa of this.listar()) {
            if (placa.nome === nome && bcrypt.compareSync(senha, placa.senha)) {
                return placa;
            }
        }
        return null;
    }
}

module.exports = PlacaDao;