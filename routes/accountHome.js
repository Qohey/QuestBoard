'use strict';
var express = require('express');
var router = express.Router();
var UserTable = require('../models/users');

router.post('/', (req, res, next) => {
  switch (req.body['mode']) {
    case 'accountInfo':
      if (req.session.UserData == null) {
        res.redirect('/');
        return;
      }
      homeProc(req, res);
      break;
    case 'deletePage':
      deletePage(req, res);
      break;
    case 'accountDelete':
      accountDeleteProc(req, res);
      break;
    case 'confirm':
      confirmProc(req, res);
      break;
    case 'back':
      backProc(req, res);
      break;
    case 'regist':
      registProc(req, res);
      break;
    case 'home':
      res.redirect('/');
  }
});

function homeProc(req, res) {
  const UserID = req.session.UserData.userID;
  UserTable.findOne({
    where: {
      userID: UserID
    }
  }).then((User) => {
    res.render('Account/accountInfo', {
      title: "アカウント情報",
      Data: User
    });
  });
  return;
}

function deletePage(req, res) {
  const UserID = req.session.UserData.userID;
  UserTable.findOne({
    where: {
      userID: UserID
    }
  }).then((User) => {
    res.render('Account/accountDelete', {
      title: "退会する",
      Data: User
    });
  });
  return;
}
function accountDeleteProc(req, res) {
  const UserID = req.session.UserData.userID;
  UserTable.count({
    where: {
      userID: UserID,
      mail: req.body['mail'],
      password: req.body['password1'],
      isDelete: false
    }
  }).then((count) => {
    if (count == 1) {
      UserTable.update({
        isDelete: true
      },
        {
          where: {
            userID: UserID
          }
        }).then(() => {
          req.session.destroy((err) => {
            res.redirect('/');
          });
        });
    }
  }).catch((err) => {

  });
  return;
}
function confirmProc(req, res) {
  const errors = errorProc(req, res);
  const data = {};
  if (errors.length > 0) {
    res.locals.errors = errors;
    data['userName'] = req.body['userName'];
    data['mail'] = req.body['mail'];
    res.render('Account/accountInfo', {
      title: "アカウント情報",
      Data: data
    });
    return;
  }
  else {
    UserTable.findOne(
      {
        where: {
          userID: req.session.UserData.userID
        }
      }).then((user) => {
        console.log(user['password'] + "!=" + req.body["oldPassword"]);
        if (user['password'] != req.body["oldPassword"]) {//古い
          res.locals.errors = ["古いパスワードが間違っています"];
          data['userName'] = req.body['userName'];
          data['mail'] = req.body['mail'];
          res.render('Account/accountInfo', {
            title: "アカウント情報",
            Data: data
          });
          return;
        }
        else {
          if (user['mail'] != req.body['mail']) {
            UserTable.count({
              where: {
                mail: req.body['mail']
              }
            }).then((count) => {
              if (count != 0) {
                res.locals.errors = ["このメールアドレスは既に使用されています"];
                data['userName'] = req.body['userName'];
                data['mail'] = req.body['mail'];
                res.render('Account/accountInfo', {
                  title: "アカウント情報",
                  Data: data
                });
                return;
              }
            });
          }
          else {
            data['userName'] = req.body['userName'];
            data['mail'] = req.body['mail'];
            data['newPassword'] = req.body['newPassword'];
            let disPass = "*******";
            res.render('Account/confirm', {
              title: "アカウント情報",
              Data: data,
              DiPass: disPass
            });
            return;
          }
        }
      });
  }
}

function backProc(req, res) {
  const data = {};
  data['userName'] = req.body['userName'];
  data['mail'] = req.body['mail'];
  data['newPassword'] = req.body['newPassword'];
  res.render('Account/accountInfo', {
    title: "アカウント情報",
    Data: data
  });
  return;
}
function registProc(req, res) {
  const errors = errorProc(req, res);
  if (errors.length > 0) {
    res.locals.errors = errors;
    homeProc(req, res);
    return;
  }
  const data = {};
  data['userID'] = req.session.UserData.userID;
  data['userName'] = req.body['userName'];
  data['mail'] = req.body['mail'];
  data['password'] = req.body['newPassword'];
  DbProc(data);
  res.render('Account/regist', {
    title: "更新完了"
  });
  return;
}

function errorProc(req, res) {
  const errors = [];
  if (req.body['userName'] === '')
    errors.push('ユーザ名が未入力です');
  if (req.body['mail'] === '')
    errors.push('メールアドレスが未入力です');
  if (req.body['oldPassword'] === '')
    errors.push('パスワードが未入力です')
  else if (req.body['oldPassword'] === '')
    errors.push('古いパスワードが未入力です')
  if (req.body['newPassword'].length != 0 && req.body['newPassword'].length < 10)
    errors.push('パスワードは10文字以上にしてください');
  return errors;
}

function DbProc(data) {
  UserTable.update({
    userName: data['userName'],
    mail: data['mail'],
    password: data['password']
  },
    {
      where: {
        userID: data['userID']
      }
    });
}

module.exports = router;