const { Sequelize, DataTypes, Model } = require('sequelize');


class Pentagono extends Model {
    /*constructor(nome, lado, senha, papel, id) {
        this.nome = nome;
        this.lado = parseFloat(lado);
        this.senha = senha;
        this.papel = papel;
        this.area();
        this.id = id
    }*/
    area(){
        const pi = Math.PI;
        const area = (5/4) * Math.pow(this.lado,2) * (1/Math.tan(pi/10));
        return area;
    }
}
module.exports = Pentagono