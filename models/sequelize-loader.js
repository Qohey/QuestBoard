'use strict';
const Sequelize = require('sequelize');
const options = {
  dialectOptions: {
    ssl: true,
  }
};
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/quest_board',
  options
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};