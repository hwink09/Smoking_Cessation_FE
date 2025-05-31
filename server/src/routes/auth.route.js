const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/google', authController.googleAuth);
authRouter.get('/verify/:token', authController.verifyEmail);
authRouter.post('/fogot-password', authController.fogotPassword);
authRouter.post('/resset-password/:token', authController.ressetPassword);

module.exports = authRouter;