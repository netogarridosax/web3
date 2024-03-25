const bcrypt = require('bcrypt');
const { DataTypes, Model } = require('sequelize');

class Placa extends Model {
    static init(sequelize) {
        return super.init({
            nome: DataTypes.TEXT,
            lado: DataTypes.FLOAT,
            senha: DataTypes.TEXT,
            papel: DataTypes.TEXT,
        }, { sequelize });
    }

    calcularArea() {
        if (!isNaN(this.lado) && this.lado >= 0) {
            const area = 2 * this.lado * this.lado * (1 + Math.sqrt(2));
            return parseFloat(area.toFixed(2));
        } else {
            return 0;
        }
    }
}

class PlacaSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Placa = Placa.init(this.sequelize);

        (async () => {
            try {
                await this.Placa.sync();
                console.log('Tabela criada com sucesso!');
            } catch (error) {
                console.error('Erro ao criar tabela:', error);
            }
        })();
    }

    async listar() {
        return this.Placa.findAll();
    }

    async inserir(placa) {
        this.validar(placa);
        placa.senha = bcrypt.hashSync(placa.senha, 10);

        return this.placa.create(placa);
    }

    async alterar(id, placa) {
        this.validar(placa, true);
        if (!placa) {
            throw new Error('Objeto placa é nulo ou indefinido');
        }

        let obj = { ...placa.dataValues };
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });

        await this.Placa.update(obj, { where: { id: id } });
    }

    async apagar(id) {
        return this.Placa.destroy({ where: { id: id } });
    }

    validar(placa, permitirSenhaEmBranco = false) {
        if (!placa.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!permitirSenhaEmBranco && !placa.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (placa.lado < 0) {
            throw new Error('mensagem_lado_invalido');
        }
    }

    async autenticar(nome, senha) {
        let placa = await this.Placa.findOne({ where: { nome } });

        if (placa && placa.senha && bcrypt.compareSync(senha, placa.senha)) {
            return placa;
        }

        // Retorna null se o usuário não for encontrado ou as senhas não coincidirem
        return placa;
    }
}

module.exports = PlacaSequelizeDao;