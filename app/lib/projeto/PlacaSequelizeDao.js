const bcrypt = require('bcrypt');
const { DataTypes, Model } = require('sequelize');

class Pentagono extends Model {
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
        this.Pentagono = Pentagono.init(this.sequelize);

        (async () => {
            try {
                await this.Pentagono.sync();
                console.log('Tabela criada com sucesso!');
            } catch (error) {
                console.error('Erro ao criar tabela:', error);
            }
        })();
    }

    async listar() {
        return this.Pentagono.findAll();
    }

    async inserir(pentagono) {
        this.validar(pentagono);
        pentagono.senha = bcrypt.hashSync(pentagono.senha, 10);

        return this.Pentagono.create(pentagono);
    }

    async alterar(id, pentagono) {
        this.validar(pentagono, true);
        if (!pentagono) {
            throw new Error('Objeto pentagono é nulo ou indefinido');
        }

        let obj = { ...pentagono.dataValues };
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });

        await this.Pentagono.update(obj, { where: { id: id } });
    }

    async apagar(id) {
        return this.Pentagono.destroy({ where: { id: id } });
    }

    validar(pentagono, permitirSenhaEmBranco = false) {
        if (!pentagono.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!permitirSenhaEmBranco && !pentagono.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (pentagono.lado < 0) {
            throw new Error('mensagem_lado_invalido');
        }
    }

    async autenticar(nome, senha) {
        let pentagono = await this.Pentagono.findOne({ where: { nome } });

        if (pentagono && pentagono.senha && bcrypt.compareSync(senha, pentagono.senha)) {
            return pentagono;
        }

        // Retorna null se o usuário não for encontrado ou as senhas não coincidirem
        return pentagono;
    }
}

module.exports = PlacaSequelizeDao;