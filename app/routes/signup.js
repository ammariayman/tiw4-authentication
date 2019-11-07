const express = require('express');
const createError = require('http-errors');
const db = require('../models/queries');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});

router.post('/', async function signupHandler(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, function(err, hash){
      await db.addUser(req.body.username, req.body.email, hash);
      res.redirect('/');
    });
    
  } catch (e) {
    next(createError(500, e));
  }
});

module.exports = router;
