'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Define = loader.database.define(
  'answers',
  {
    answerID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    questionID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    answerContent: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    isBestAnswer: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = Define;