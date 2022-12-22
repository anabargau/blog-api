const Posts = require('../models/post');
const { body, validationResult } = require('express-validator');
const { findByIdAndRemove } = require('../models/post');
const async = require('async');
const Comments = require('../models/comment');

exports.post_new_get = (req, res, next) => {
  res.status(200).send('Protected route');
};

exports.post_new_post = [
  body('title', 'Please enter a title').trim().isLength({ min: 1 }).escape(),
  body('content', "Please enter the post's content")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = new Posts({
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      published: req.body.published,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors,
        post,
        user: res.locals.currentUser,
      });
      return;
    }
    post.save((err, saved_post) => {
      if (err) {
        return next(err);
      }
      res.json({
        post,
        user: res.locals.currentUser,
      });
    });
  },
];

exports.post_get = (req, res, next) => {
  async.parallel(
    {
      post(callback) {
        Posts.findById(req.params.id).exec(callback);
      },
      comments(callback) {
        Comments.find({ post: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      console.log(results.comments);
      res.json({
        post: results.post,
        comments: results.comments,
        user: res.locals.currentUser,
      });
    }
  );
}; // to verify if res.locals.currentUser, else redirect to login

exports.post_edit_get = (req, res, next) => {
  Posts.findById(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    res.json({ post, user: res.locals.currentUser });
  });
};

exports.post_edit_post = [
  body('title', 'Please enter a title').trim().isLength({ min: 1 }).escape(),
  body('Content', "Please enter the post's content")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = new Posts({
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      published: req.body.published,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors,
        post,
        user: res.locals.currentUser,
      });
      return;
    }
    Posts.findByOdAndUpdate(req.params.id, post, (err, updated_post) => {
      if (err) {
        return next(err);
      }
      res.json({
        post: updated_post,
        user: res.locals.currentUser,
      });
    });
  },
];

exports.post_delete_get = (req, res, next) => {};

exports.post_delete_post = (req, res, next) => {
  findByIdAndRemove(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
