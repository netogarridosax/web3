const Pentagono = require("./Placa");
const bcrypt = require('bcrypt');

class PlacasDao {
    constructor() {
        this.pentagonos = [];
    }
    listar() {
        return this.pentagonos;
    }

    inserir(pentagono) {
        this.validar(pentagono);
        pentagono.senha = bcrypt.hashSync(pentagono.senha, 10);
        this.pentagonos.push(pentagono);
    }

    alterar(id, pentagono) {
        this.validar(pentagono);
        this.pentagonos[id] = pentagono;
    }

    apagar(id) {
        this.pentagonos.splice(id, 1);
    }

    validar(pentagono) {
        if (pentagono.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (pentagono.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }
    autenticar(nome, senha) {
        for (let pentagono of this.listar()) {
            if (pentagono.nome == nome && bcrypt.compareSync (senha, pentagono.senha)) {
                return pentagono;
            }
        }
        return null;
    }

}

module.exports = PlacasDao;
