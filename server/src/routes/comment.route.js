const express = require('express');
const commmentController = require('../controllers/comment.controller');
const commentRouter = express.Router();
const { validateToken } = require('../middlewares/authMiddleware');

commentRouter.post('/create', validateToken, commmentController.addComment);
commentRouter.get('/post/:id', validateToken, commmentController.getCommentsByPostId);
commentRouter.put('/:id', validateToken, commmentController.updateComment);
commentRouter.delete('/:id', validateToken, commmentController.deleteComment);

module.exports = commentRouter;