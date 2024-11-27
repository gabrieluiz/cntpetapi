const { Sequelize } = require('sequelize');
const config = require('./config.json'); // Configurações do config.json

const env = process.env.NODE_ENV || 'development'; // Define o ambiente
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  define: {
    freezeTableName: true, // Impede a pluralização dos nomes das tabelas
  },
});

module.exports = sequelize;
