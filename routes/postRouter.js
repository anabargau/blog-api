const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/new', postController.post_new_get);
router.post('/new', postController.post_new_post);
router.get('/:id', postController.post_get);
router.post('/:id/new_comment', commentController.comment_new_post);
router.get('/:id/edit', postController.post_edit_get);
router.post('/:id/edit', postController.post_edit_post);
router.get('/:id/delete', postController.post_delete_get);
router.post('/:id/delete', postController.post_delete_post);

module.exports = router;
