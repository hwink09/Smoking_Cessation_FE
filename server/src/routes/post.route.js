const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const { validateToken } = require('../middlewares/authMiddleware');

postRouter.post('/create', validateToken, postController.createPost);
postRouter.get('/', postController.getAllPosts);
postRouter.post('/like/:id', validateToken, postController.likePost);
postRouter.get('/user/:id', validateToken, postController.getPostByUserId);
postRouter.get('/tag/:id', validateToken, postController.getPostByTagId);
postRouter.put('/:id', validateToken, postController.editPost);
postRouter.delete('/:id', validateToken, postController.deletePost);

module.exports = postRouter;