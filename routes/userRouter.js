var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/log-in', userController.login_get);
router.post('/log-in', userController.login_post);
router.get('/sign-up', userController.signup_get);
router.post('/sign-up', userController.signup_post);
router.post('/log-out', userController.logout_post);

module.exports = router;
