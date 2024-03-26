const Placa = require("./placa")
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes, Model } = require('sequelize');

class PlacasSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Placa = Placa.init({
            nome: DataTypes.TEXT,
            lado: DataTypes.FLOAT,
            senha: DataTypes.TEXT,
            papel: DataTypes.TEXT,
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }
        }, { sequelize });

        (async () => {
            await this.Placa.sync();
            console.log('Tabela criada com sucesso!');
        })();
    }

    listar() {
        return this.Placa.findAll();
    }

    inserir(placa) {
        this.validar(placa);
        placa.senha = bcrypt.hashSync(placa.senha, 10);
        
        return placa.save();
    }

    alterar(id, placa) {
        this.validar(placa);
        let obj = {...placa.dataValues};
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });
        console.log("alterar", obj);
        Placa.update(obj, { where: { id: id } })
    }

    apagar(id) {
        return Placa.destroy({ where: { id: id } });
    }

    validar(placa) {
        if (!placa.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!placa.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (placa.lado < 0 || placa.lado > 10) {
            throw new Error('mensagem_Placa_invalida');
        }
    }

    async autenticar(nome, senha) {
        let placa = await this.Placa.findOne({where: {nome}});
        console.log(placa.senha)
        /*if (bcrypt.compareSync(senha, placa.senha)) {
            return placa;
        }*/
        return placa;
    }
}

module.exports = PlacasSequelizeDao;