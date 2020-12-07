
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/auth-check');


router.post('/signup', userController.signup_user);

router.post('/login', userController.login_user);

router.delete('/:userId', checkAuth, userController.delete_user);

 module.exports = router;