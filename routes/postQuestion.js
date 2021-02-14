'use strict';
var express = require('express');
var router = express.Router();
var UserTable = require('../models/users');
var QuestionTable = require('../models/questions');

router.post('/', (req, res, next) => {
  const mode = req.body['mode'];
  switch (mode) {
    case 'edit':
      editProc(req, res);
      break;
    case 'confirm':
      confirmProc(req, res);
      break;
    case 'regist':
      registProc(req, res);
      break;
    default:
      res.redirect('/');
      break;
  }
});

function editProc(req, res) {
  const title = '質問投稿';
  const data = {};
  data['questionTitle'] = req.body['questionTitle'];
  data['questionContent'] = req.body['questionContent'];
  res.render('PostQuestion/edit', {
    title: title,
    Data: data
  });
}

function confirmProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    editProc(req, res);
    return;
  }
  const title = '質問内容確認';
  const data = {};
  data['questionTitle'] = req.body['questionTitle'];
  data['questionContent'] = req.body['questionContent'];
  res.render('PostQuestion/confirm', {
    title: title,
    Data: data
  });
}

function registProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    editProc(req, res);
    return;
  }
  const data = {};
  data['userID'] = req.session.UserData.userID;
  data['questionTitle'] = req.body['questionTitle'];
  data['questionContent'] = req.body['questionContent'];
  console.dir(data);
  DbProc(data);
  res.redirect('/');
}

function errorProc(req, res) {
  const errors = [];
  if (req.body['questionTitle'] === '')
    errors.push('タイトルが未入力です');
  if (req.body['questionContent'] === '')
    errors.push('質問内容が未入力です');
  return errors;
}

function DbProc(data) {
  QuestionTable.create({
    userID: data['userID'],
    questionTitle: data['questionTitle'],
    questionContent: data['questionContent'],
    answered: false,
    isDelete: false
  }).catch((err) => {
    console.error("エラー:" + err);
  });
}

module.exports = router;