'use strict';
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

router.post('/', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;