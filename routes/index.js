'use strict';
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: "質問屋さん"
  });
});

router.post('/', (req, res, next) => {
  res.render('index', {
    title: "質問屋さん"
  });
});


module.exports = router;
