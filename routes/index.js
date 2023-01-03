var express = require('express');
var router = express.Router();
const Posts = require('../models/post');

router.get('/', function (req, res, next) {
  Posts.find()
    .sort({ date: -1 })
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      res.json({
        posts,
        user: res.locals.currentUser,
      });
    });
  /* if (res.locals.currentUser) {
    Posts.find()
      .sort({ date: -1 })
      .exec((err, posts) => {
        if (err) {
          return next(err);
        }
        res.json({
          posts,
        });
      });
  } else {
    res.redirect('/user/log-in');
  } */
});

module.exports = router;
