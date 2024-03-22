const { Sequelize, DataTypes, Model } = require('sequelize');

class Placa extends Model {
    calcularArea() {
        if (!isNaN(this.lado) && this.lado >= 0) {
            this.area = 2 * this.lado * this.lado * (1 + Math.sqrt(2));
            this.area = parseFloat(this.area.toFixed(2));
            this.tipo = this.area > 20 ? 'grande' : 'pequeno';
        } else {
            this.area = 0;
            this.tipo = 'desconhecido';
        }
    }

    setLado(lado) {
        this.lado = parseFloat(lado);
        this.calcularArea();
    }
}

module.exports = (sequelize) => {
    Placa.init({
        
        nome: DataTypes.STRING,
        lado: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'Placa'
    });

    return Placa;
};
