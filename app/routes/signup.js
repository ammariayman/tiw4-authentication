const express = require('express');
const createError = require('http-errors');
const debug = require('debug')('app:signup');

const { check, validationResult } = require('express-validator');

const db = require('../models/queries');
const hashing = require('../utils/hashing');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});

router.post(
  '/',
  [
    check('username')
      .isLength({ min: 1 })
      .withMessage('Username is required')
      .trim(),
    check('email')
      .isEmail()
      .withMessage('Email is required'),
    check('password')
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error('Password confirmation is incorrect');
        }
      })
  ],
  async function signupHandler(req, res, next) {
    const errors = validationResult(req);
    debug(errors);
    if (!errors.isEmpty()) {
      res.render('signup', {
        title: 'TIW4 -- LOGON',
        errors: errors.array()
      });
      return;
    }
    try {
      const hashedPwd = await hashing.hashPassword(req.body.password);
      await db.addUser(req.body.username, req.body.email, hashedPwd);
      res.redirect('/');
    } catch (e) {
      next(createError(500, e));
    }
  }
);

module.exports = router;
