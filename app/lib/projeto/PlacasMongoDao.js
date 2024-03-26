const Placa = require("./placa")
const bcrypt = require('bcrypt')

class PlacasMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'projeto';
        this.colecao = 'placas';
    }
    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const placas = await collection.find();
        return await placas.toArray()
    }

    inserir(placa) {
        this.validar(placa);
        placa.senha = bcrypt.hashSync(placa.senha, 10);
        
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO placas (nome, lado, , senha, id_papel) VALUES (?, ?, ?, ?, ?);
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
        this.placas[id] = placa;
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
        console.log(2, placa);
        if (!placa.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!placa.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (placa.lado < 0 || placa.lado > 10) {
            throw new Error('mensagem_placa_invalida');
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

module.exports = PlacasMongoDao;