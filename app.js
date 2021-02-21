var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');

//モデルの読み込み
var UsersTable = require('./models/users');
var QuestionsTable = require('./models/questions');
var AnswersTable = require('./models/answers');
var RepliesTable = require('./models/replies');

//モデルに合わせたテーブル作成
UsersTable.sync().then(() => {
  QuestionsTable.belongsTo(UsersTable, { foreignKey: 'userID' });
  QuestionsTable.sync().then(() => {
    AnswersTable.belongsTo(QuestionsTable, { foreignKey: 'questionID' });
    AnswersTable.sync().then(() => {
      RepliesTable.belongsTo(AnswersTable, { foreignKey: 'answerID' });
      RepliesTable.sync();
    });
  });
});

//ルータの読込
var indexRouter = require('./routes/index');
var createAccountRouter = require('./routes/createAccount');
var loginRouter = require('./routes/login');
var postQuestionRouter = require('./routes/postQuestion');
var logoutRouter = require('./routes/logout');
var questionBoard = require('./routes/questionBoard');
var accountHome = require('./routes/accountHome');
var myQuestion = require('./routes/myQuestion');

var app = express();
//helmetの設定
app.use(helmet());
//Viewエンジンに関する設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionOption = {
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 30
  }
}
app.use(session(sessionOption));

//共通処理 sessionの情報をpugに飛ばす
app.use('/*', (req, res, next) => {
  if (req.session.UserData) {
    res.locals.UserData = req.session.UserData;
  }
  next();
});
//ルータの設定
app.use('/', indexRouter);
app.use('/CreateAccount', createAccountRouter);
app.use('/login', loginRouter);
app.use('/PostQuestion', postQuestionRouter);
app.use('/QuestionBoard', questionBoard);
app.use('/logout', logoutRouter);
app.use('/AccountHome', accountHome);
app.use('/MyQuestion',myQuestion);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
