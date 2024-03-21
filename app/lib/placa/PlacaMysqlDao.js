const Placa = require("./Placa.js");
const bcrypt = require('bcrypt');

class PlacaMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT o.id, o.nome, o.lado, p.nome as papel FROM placas o JOIN papeis p ON o.id_papel = p.id', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
    
                let placas = linhas.map(linha => {
                    let { id, nome, lado, papel } = linha;
                    return new Placa(id, nome, lado, papel); // Corrigi a ordem dos parâmetros
                });
    
                resolve(placas);
            });
        });
    }    

    inserir(placa) {
        this.validar(placa);
        placa.senha = bcrypt.hashSync(placa.senha, 10);
        
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                reject('Erro: Conexão com o banco de dados não foi estabelecida.');
                return;
            }
            let sql = `INSERT INTO placas (nome, lado, senha, id_papel) VALUES (?, ?, ?, ?);`;
            console.log({ sql }, placa);
    
            this.pool.query(sql, [placa.nome, placa.lado, placa.senha, 1], function (error, resultado, fields) {
                if (error) {
                    reject('Erro: ' + error.message);
                } else {
                    if (resultado.length > 0) {
                        let linha = resultado[0];
                        if (bcrypt.compareSync(placa.senha, linha.senha)) {
                            const { nome, lado } = linha;
                            resolve(new placa(nome, lado));
                        } else {
                            resolve(resultado.insertId);
                        }
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    
    alterar(id, placa) {
        this.validar(placa);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE placas SET nome=?, lado=? WHERE id=?';
            this.pool.query(sql, [placa.nome, placa.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                // Corrigi o tratamento do resultado da alteração
                if (resultado.affectedRows > 0) {
                    resolve(new placa(id, placa.nome, placa.lado, placa.papel));
                } else {
                    resolve(null);
                }
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM placas WHERE id=?;`;
            this.pool.query(sql, [id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(id);
            });
        });
    }

    validar(placa) {
        if (!placa.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (placa.lado < 0) {
            throw new Error('Lado do placa não pode ser menor que 0');
        }
    }
    
    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM placas WHERE nome=?';
            this.pool.query(sql, [nome], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { id, nome, lado, papel } = linha;
                        return resolve(new placa(id, nome, lado, papel));
                    }
                }
                return resolve(null);
            });
        });
    }
} 
module.exports = PlacaMysqlDao;