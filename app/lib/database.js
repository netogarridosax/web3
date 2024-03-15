// database.js
const { Sequelize } = require('sequelize');
const waitPort = require('wait-port');

module.exports = async function() {
  let params = {
    host: 'database',
    port: 3306, 
    output: 'silent',
    timeout: 30000
  };

  const open = await waitPort(params);
  if(open) {
    console.log('Banco de dados está pronto. Iniciando a aplicação...');
    
    const sequelize = new Sequelize(
      process.env.MARIADB_DATABASE,
      process.env.MARIADB_USER,
      process.env.MARIADB_PASSWORD,
      {
          host: 'database',
          dialect: 'mariadb'
      }
    );

    sequelize.authenticate()
      .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
      })
      .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
      });

    return sequelize;

  } else {
    console.log('Não foi possível conectar ao banco de dados. Encerrando...');
    process.exit(1);
  }
};