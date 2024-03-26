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
        placa.senha = bcrypt.hashSync(placa.senha, 10);

        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO placas (nome, lado, senha, id_papel) VALUES (?, ?, ?, ?, ?);
            `;
            console.log({sql}, placa);
            this.pool.query(sql, [placa.nome, placa.lado, placa.senha, placa.id_papel], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, placa) {
        this.validar(placa);
        this.estudantes[id] = estudante;
    }
    
    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM placas WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(id);
            });
        });
    }

    validar(placa) {
        console.log(2, estudante);
        if (placa.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!placa.senha) {
            throw new Error('mensagem_senha_em_branco');
        
        }
        if (placa.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }
    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT e.*, p.nome as papel FROM placas e JOIN papeis p ON e.id_papel = p.id WHERE e.nome=?`;
            this.pool.query(sql, [nome, senha], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { id, nome, lado, senha, papel } = linha;
                        return resolve(new Placa(nome, lado, senha, papel, id));
                    }
                }
                return resolve(null);
            });
        });
    }

}

module.exports = PlacasMysqlDao;