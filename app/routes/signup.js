const express = require('express');
const createError = require('http-errors');
const db = require('../models/queries');
const hashing = require('../utils/hashing');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});

router.post('/', async function signupHandler(req, res, next) {
  try {
    const hashedPwd = await hashing.hashPassword(req.body.password);
    await db.addUser(req.body.username, req.body.email, hashedPwd);
    res.redirect('/');
  } catch (e) {
    next(createError(500, e));
  }
});

module.exports = router;
