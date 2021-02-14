'use strict';
var express = require('express');
var router = express.Router();
var UserTable = require('../models/users');

router.post('/', (req, res, next) => {
  const mode = req.body['mode'];
  switch (mode) {
    case 'login':
      loginProc(req, res);
      break;
    case 'signin':
      signinProc(req, res);
      break;
    default:
      req.redirect('/');
      break;
  }
});

function loginProc(req, res) {
  const title = 'ログイン画面';
  const data = {};
  data['mail'] = req.body['mail'];
  data['password'] = req.body['password'];
  res.render('login/login', {
    title: title,
    Data: data
  });
  return;
}

function signinProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    loginProc(req, res);
    return;
  }
  UserTable.count({
    where: {
      mail: req.body['mail'],
      password: req.body['password'],
      isDelete: false
    }
  }).then((count) => {
    if (count == 0) {
      res.locals.errors = ["メールアドレスまたはパスワードが間違っています"];
      loginProc(req, res);
      return;
    }
    else {
      UserTable.findOne({
        attributes: ['userID', 'userName', 'mail'],
        where: {
          mail: req.body['mail'],
          password: req.body['password'],
          isDelete: false
        }
      }).then((User) => {
        req.session.UserData = {
          userID: User.userID,
          userName: User.userName,
          mail: User.mail
        };
        res.render('index', {
          title: "質問屋さん",
          UserData: req.session.UserData
        });
      });
    }
  });
  return;
}

function errorProc(req, res) {
  const errors = [];
  if (req.body['mail'] === '')
    errors.push('メールアドレスが未入力です');
  if (req.body['password'] === '')
    errors.push('パスワードが未入力です');
  return errors;
}

module.exports = router;