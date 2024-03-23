const Pentagono = require("./Pentagono")
const bcrypt = require('bcrypt')

class PlacasMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT o.id, o.nome, o.lado, p.nome as papel FROM pentagono o JOIN papeis p ON o.id_papel = p.id', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let pentagonos = linhas.map(linha => {
                    let { nome, lado } = linha;
                    return new Pentagono(nome, lado);
                })
                resolve(pentagonos);
            });
        });
    }

    inserir(pentagono) {
        this.validar(pentagono);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO pentagonos (nome, lado) VALUES (?, ?);';
            console.log({sql}, pentagono);
            this.pool.query(sql, [pentagono.nome, pentagono.lado], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, pentagono) {
        this.validar(pentagono);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE pentagonos SET nome=?, lado=? WHERE id=?;';
            this.pool.query(sql, [pentagono.nome, pentagono.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }
    

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM pentagonos WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
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
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM pentagonos WHERE nome=?';
            this.pool.query(sql, [nome], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { id, nome, lado, papel } = linha;
                        return resolve(new Pentagono(id, nome, lado, papel));
                    }
                }
                return resolve(null);
            });
        });
    }
} 

module.exports = PlacasMysqlDao;