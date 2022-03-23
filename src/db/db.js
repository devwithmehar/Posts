const Sequelize = require('sequelize');

const db = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: 'database.db',
  logging: false,
});

module.exports = db;
