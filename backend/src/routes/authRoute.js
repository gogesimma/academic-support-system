const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validate, userValidation } = require('../middleware/validation');

const router = express.Router();

router.post('/register', userValidation.register, validate, AuthController.register);
router.post('/login', userValidation.login, validate, AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/change-password', authMiddleware, AuthController.changePassword);

module.exports = router;