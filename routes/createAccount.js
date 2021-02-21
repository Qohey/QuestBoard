'use strict';
var express = require('express');
var router = express.Router();
var UserTable = require('../models/users');

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
    case 'home':
      res.redirect('/');
      break;
    default:
      res.redirect('/');
      break;
  }
  return;
});

function editProc(req, res) {
  const data = {};
  data['userName'] = req.body['userName'];
  data['mail'] = req.body['mail'];
  res.render('CreateAccount/edit', {
    title: "アカウント作成",
    Data: data
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
  UserTable.count({
    where: {
      mail: req.body['mail']
    }
  }).then((count) => {
    if (count != 0) {
      res.locals.errors = ["このメールアドレスは既に使用されています"];
      editProc(req, res);
      return;
    } else {
      const data = {};
      data['userName'] = req.body['userName'];
      data['mail'] = req.body['mail']
      data['password1'] = req.body['password1'];
      data['password2'] = req.body['password2'];
      let disPass = "********";
      res.render('CreateAccount/confirm', {
        title: "確認",
        Data: data,
        DisPass: disPass
      });
    }
  });
  return;
}

function registProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    editProc(req, res);
  }
  const data = {};
  data['userName'] = req.body['userName'];
  data['mail'] = req.body['mail'];
  data['password'] = req.body['password1'];
  DbProc(data);
  res.render('CreateAccount/regist', {
    title: "登録完了"
  });
  return;
}

function errorProc(req, res) {
  const errors = [];
  if (req.body['userName'] === '')
    errors.push('ユーザ名が未入力です');
  if (req.body['mail'] === '')
    errors.push('メールアドレスが未入力です');
  if (req.body['password1'] === '' && req.body['password2'] === '')
    errors.push('パスワードが未入力です')
  else if (req.body['password1'] === '')
    errors.push('パスワードが未入力です')
  else if (req.body['password2'] === '')
    errors.push('パスワード(確認用)が未入力です')
  else if (req.body['password1'] != req.body['password2'])
    errors.push('パスワードが不一致です');
  else if (req.body['password1'].length < 10)
    errors.push('パスワードは10文字以上にしてください');
  return errors;
}

function DbProc(data) {
  UserTable.create({
    userName: data['userName'],
    mail: data['mail'],
    password: data['password']
  });
}

module.exports = router;