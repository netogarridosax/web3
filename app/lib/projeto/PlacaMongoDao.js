const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class PlacaMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'arquitetura';
        this.colecao = 'placas';
    }

    async conectar() {
        if (!this.client.isConnected()) {
            await this.client.connect();
        }
        this.db = this.client.db(this.banco);
    }

    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const placas = await collection.find().toArray();
        return placas;
    }

    async inserir(pentagono) {
        this.validar(pentagono);

        pentagono.senha = bcrypt.hashSync(pentagono.senha, 10);
        
        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const resultado = await collection.insertOne(pentagono);
        return resultado.insertedId;
    }

    async alterar(id, pentagono) {
        this.validar(pentagono);

        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { nome: pentagono.nome, lado: pentagono.lado } }
        );

        if (resultado.matchedCount > 0) {
            return new Pentagono(id, pentagono.nome, pentagono.lado, pentagono.papel);
        } else {
            return null;
        }
    }

    async apagar(id) {
        try {
            await this.conectar();
            const collection = this.db.collection(this.colecao);
            const objectId = new ObjectId(id);

            const result = await collection.deleteOne({ _id: objectId });

            if (result.deletedCount > 0) {
                console.log(`Placa removido com sucesso: ${id}`);
                return true;
            } else {
                console.log(`Nenhum placa foi removido: ${id}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao apagar placa:', error);
            return false;
        }
    }

    validar(pentagono) {
        if (!pentagono.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (pentagono.lado < 0) {
            throw new Error('Lado do pentagono não pode ser menor que 0');
        }
    }
    
    async autenticar(nome, senha) {
        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const placa = await collection.findOne({ nome });

        if (placa && bcrypt.compareSync(senha, placa.senha)) {
            const { _id, nome, lado, papel } = placa;
            return new Pentagono(_id, nome, lado, papel);
        }

        return null;
    }
}

module.exports = PlacaMongoDao;