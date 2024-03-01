const Placa = require("./placa")
const bcrypt = require('bcrypt')

class PlacasMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM placas;', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let placas = linhas.map(linha => {
                    let { nome, lado } = linha;
                    return new Placa(nome, lado);
                })
                resolve(placas);
            });
        });
    }

    inserir(placa) {
        this.validar(placa);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO placas (nome, lado) VALUES (?, ?);';
            console.log({sql}, placa);
            this.pool.query(sql, [placa.nome, placa.lado], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, placa) {
        this.validar(placa);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE placas SET nome=?, lado=? WHERE id=?;';
            this.pool.query(sql, [placa.nome, placa.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }
    

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM placas WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(placa) {
        if (placa.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (placa.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }
    /*
    autenticar(nome, senha) {
        for (let placa of this.listar()) {
            if (placa.nome == nome && bcrypt.compareSync(senha, placa.senha)) {
                return placa;
            }
        }
        return null;
    }*/

}

module.exports = PlacasMysqlDao;