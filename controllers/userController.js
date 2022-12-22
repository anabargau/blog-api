require('dotenv').config();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('../jwt');
const Users = require('../models/user');
const bcrypt = require('bcrypt');

exports.login_get = (req, res, next) => {
  return res.json({ result: 'Hello, user' });
};

exports.login_post = (req, res, next) => {
  let { username, password } = req.body;
  Users.findOne({ username: username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Invalid username' }] });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const secret = process.env.SECRET_KEY;
        const token = jwt.sign({ username }, secret, { expiresIn: '1d' });
        return res.json({
          message: 'Auth passed',
          token,
          user,
        });
      } else {
        return res.sattus(400).json({ errors: [{ msg: 'Invalid username' }] });
      }
    });
  });
};

exports.signup_get = (req, res, next) => {
  res.send('Hello');
};

exports.signup_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a username')
    .escape()
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Users.findOne({ username: value }, (err, user) => {
          if (err) {
            reject(new Error(err.message));
          }
          if (user) {
            reject(new Error('This username is already in use'));
          }
          resolve(true);
        });
      });
    }),
  body('password', 'Password must not be empty').isLength({ min: 1 }),
  body(
    'confirm_password',
    'Confirm password field must have the same value as the password field'
  ).custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hash_password) => {
      if (err) {
        return next(err);
      }
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const user = new Users({
        username: req.body.username,
        password: hash_password,
        admin: false,
      });
      user.save((err, saved_user) => {
        if (err) {
          return next(err);
        }
        const secret = process.env.SECRET_KEY;
        jwt.sign({ saved_user }, secret, { expiresIn: '1d' });
        return res.redirect('http://localhost:3000');
      });
    });
  },
];

exports.logout_post = (req, res, next) => {
  res.status(202).clearCookie('auth-token').redirect('http://localhost:3000');
};
