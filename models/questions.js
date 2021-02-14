'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Define = loader.database.define(
  'questions',
  {
    questionID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    questionTitle: {
      type: Sequelize.STRING,
      allowNull: false
    },
    questionContent: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    answered: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isDisplay: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = Define;