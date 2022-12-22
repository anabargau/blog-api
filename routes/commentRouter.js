const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:id/delete', commentController.comment_delete_post);

module.exports = router;
