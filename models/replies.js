'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Define = loader.database.define(
  'replies',
  {
    replyID: {
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
    answerID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    replyContent: {
      type: Sequelize.TEXT,
      allowNull: false
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