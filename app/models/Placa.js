const { DataTypes } = require('sequelize');
const getSequelize = require('../lib/database');

module.exports = async function() {
  const sequelize = await getSequelize();

  const Placa = sequelize.define('Placa', {
      nome: {
          type: DataTypes.STRING,
          allowNull: false
      },
      lado: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
  }, {});

  await sequelize.sync();

  return Placa;
};