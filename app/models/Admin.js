// models/Admin.js
const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const Admin = sequelize.define('Admin', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    // Aguarda a sincronização do modelo com o banco de dados
    await Admin.sync();

    return Admin;
};