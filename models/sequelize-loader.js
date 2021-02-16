'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.HEROKU_POSTGRESQL_BLACK_URL || 'postgres://postgres:postgres@localhost/quest_board'
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};