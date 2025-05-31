const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/google', authController.googleAuth);
authRouter.get('/verify/:token', authController.verifyEmail);

module.exports = authRouter;