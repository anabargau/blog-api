require('dotenv').config();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment');

exports.comment_new_post = [
  body('title', 'Please enter a comment title')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('content', 'Please enter your comment')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const comment = new Comment({
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      user: '63a1a7d7ffb74490e8e211db', //res.locals.currentUser,
      post: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({
        comment,
        errors: errors.array(),
        user: res.locals.currentUser,
      });
      return;
    }
    comment.save((err, saved_comment) => {
      if (err) {
        return next(err);
      }
      res.redirect(`http://localhost:3000/post/${req.params.id}`);
    });
  },
];

exports.comment_delete_post = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id, (err, deleted_comment) => {
    if (err) {
      return next(err);
    }
    res.redirect(`post/${deleted_comment.post}`);
  });
};
