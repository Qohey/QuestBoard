'use strict';
var express = require('express');
var router = express.Router();
var UserTable = require('../models/users');
var QuestionTable = require('../models/questions');
var AnswerTable = require('../models/answers');
var ReplyTable = require('../models/replies');

router.post('/', (req, res, next) => {
  switch (req.body['mode']) {
    case 'board':
      homeProc(req, res);
      break;
    case 'answer':
      answerProc(req, res);
      break;
    case 'read':
      readProc(req, res);
      break;
    case 'deleteAnswer':
      deleteAnswerProc(req, res);
      break;
    case 'bestAnswer':
      bestAnswerProc(req, res);
      break;
    case 'deleteReply':
      deleteReplyProc(req, res);
      break;
    case 'reply':
      replyProc(req, res);
      break;
    default:
      res.redirect('/');
  }
});

function homeProc(req, res) {
  QuestionTable.findAll({
    where: {
      isDisplay: true,
      isDelete: false
    },
    order: [['questionID', 'DESC']]
  }).then((questions) => {
    res.render('QuestionBoard/Board', {
      title: "質問屋さん",
      Questions: questions
    });
  });
}

function readProc(req, res) {
  if (req.body['readOnly'] == "false")
    var ReadOnly = false;
  else if(req.body['readOnly'] == "true")
    var ReadOnly = true;
  QuestionTable.findOne({
    where: {
      questionID: req.body['questionID'],
      isDelete: false
    }
  }).then((question) => {
    AnswerTable.findAll({
      where: {
        questionID: question.questionID,
        isDelete: false
      },
      order: [['answerID', 'ASC']]
    }).then((answers) => {
      const userid = [];
      answers.forEach(answer => {
        userid.push(answer.dataValues.userID);
      });
      UserTable.findAll({
        attributes: ['userID', 'userName'],
      }).then((users) => {
        ReplyTable.findAll({
          where: {
            questionID: question.questionID,
            isDelete: false
          },
          order: [['replyID', 'ASC']]
        }).then((replies) => {
          res.render('QuestionBoard/Answer', {
            title: "質問屋さん",
            Users: users,
            Question: question,
            Answers: answers,
            Replies: replies,
            ReadOnly: ReadOnly
          });
        });
      });
    });
  });
  return;
}

function answerProc(req, res) {
  const data = {};
  data['userID'] = req.session.UserData.userID;
  data['questionID'] = req.body['questionID'];
  data['answerContent'] = req.body['answerContent'];
  AnswerTable.create({
    userID: data['userID'],
    questionID: data['questionID'],
    answerContent: data['answerContent'],
    isBestAnswer: false,
    isDelete: false
  }).then(() => {
    readProc(req, res);
  });
  return;
}

function deleteAnswerProc(req, res) {
  AnswerTable.update({
    isDelete: true
  },
    {
      where: {
        answerID: req.body['answerID']
      }
    }).then(() => {
      ReplyTable.update({
        isDelete: true
      },
        {
          where: {
            questionID: req.body['questionID'],
            answerID: req.body['answerID']
          }
        });
      });
  readProc(req, res);
}

function bestAnswerProc(req, res) {
  AnswerTable.update({
    isBestAnswer: true
  },
  {
    where: {
      answerID: req.body['answerID']
    }
  }).then(() => {
    QuestionTable.update({
      answered: true
    },
    {
      where: {
        questionID: req.body['questionID']
      }
    }).then(() => {
      homeProc(req, res);      
    });
  });
  return;
}

function deleteReplyProc(req, res) {
  ReplyTable.update({
    isDelete: true
  },
    {
      where: {
        replyID: req.body['replyID']
      }
    });
    readProc(req, res);
}

function replyProc(req, res) {
  const data = {};
  data['replyContent'] = req.body['replyContent'];
  data['userID'] = req.session.UserData.userID;
  data['questionID'] = req.body['questionID'];
  data['answerID'] = req.body['answerID'];
  ReplyTable.create({
    userID: data['userID'],
    questionID: data['questionID'],
    answerID: data['answerID'],
    replyContent: data['replyContent']
  });
  readProc(req, res);
}
module.exports = router;