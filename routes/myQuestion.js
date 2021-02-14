'use strict';
var express = require('express');
var router = express.Router();
var QuestionTable = require('../models/questions');
var AnswerTable = require('../models/answers');
var ReplyTable = require('../models/replies');

router.post('/', (req, res, next) => {
  switch (req.body['mode']) {
    case 'MyQuestion':
      MyQuestionProc(req, res);
      break;
    case 'edit':
      editProc(req, res);
      break;
    case 'del':
      delProc(req, res);
      break;
    case 'back':
      backProc(req, res);
      break;
    case 'confirm':
      confirmProc(req, res);
      break;
    case 'regist':
      registProc(req, res);
      break;
  }
});

function MyQuestionProc(req, res) {
  QuestionTable.findAll({
    where: {
      userID: req.session.UserData.userID,
      isDelete: false
    },
    order: [['questionID', 'ASC']]
  }).then((questions) => {
    res.render('MyQuestion/myQuestions', {
      Questions: questions
    });
  });
  return;
}

function editProc(req, res) {
  QuestionTable.findOne({
    where: {
      questionID: req.body['questionID']
    }
  }).then((question) => {
    res.render('MyQuestion/edit', {
      Question: question
    });
  });
  return;
}

function delProc(req, res) {
  QuestionTable.update({
    isDisplay: false,
    isDelete: true
  },
  {
    where: {
      questionID: req.body['questionID']
    }
  }).then(() => {
    AnswerTable.update({
      isDelete: true
    },
    {
      where: {
        questionID: req.body['questionID']
      }
    }).then(() => {
      ReplyTable.update({
        isDelete: true
      },
      {
        where: {
          questionID: req.body['questionID']
        }
      }).then(() => {
        MyQuestionProc(req, res);
        return;
      });
    });
  });
}

function backProc(req, res) {
  const data = {};
  data['questionID'] = req.body['questionID'];
  data['questionTitle'] = req.body['questionTitle'];
  data['questionContent'] = req.body['questionContent'];
  data['isDisplay'] = req.body['isDisplay'];
  res.render('MyQuestion/edit', {
    Question: data
  });
  return;
}

function confirmProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    editProc(req, res);
    return;
  }
  const data = {};
  data['questionID'] = req.body['questionID'];
  data['questionTitle'] = req.body['questionTitle'];
  data['questionContent'] = req.body['questionContent'];
  data['isDisplay'] = req.body['isDisplay'];
  res.render('MyQuestion/confirm', {
    Question: data
  });
  return;
}

function registProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    editProc(req, res);
    return;
  }
  QuestionTable.update({
    questionTitle: req.body['questionTitle'],
    questionContent: req.body['questionContent'],
    isDisplay: req.body['isDisplay']
  },
  {
    where: {
      questionID: req.body['questionID']
    }
  }).then(() => {
    MyQuestionProc(req, res);
  });
  return;
}

function errorProc(req, res) {
  const errors = [];
  if (req.body['questionTitle'] === '')
    errors.push('タイトルが未入力です');
  if (req.body['questionContent'] === '')
    errors.push('質問内容が未入力です');
  return errors;
}
module.exports = router;