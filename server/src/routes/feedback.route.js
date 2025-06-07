const express = require('express');
const feedbackRouter = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { validateToken } = require('../middlewares/AuthMiddleware');
// Tạo mới feedback
feedbackRouter.post('/', validateToken, feedbackController.createFeedback);

// Lấy tất cả feedback liên quan tới một user
feedbackRouter.get('/user/:id', validateToken, feedbackController.getFeedbackByUser);

// Lấy feedback dành cho một coach
feedbackRouter.get('/coach/:id', validateToken, feedbackController.getCoachFeedback);

// Xóa feedback
feedbackRouter.delete('/:id', validateToken, feedbackController.deleteFeedback);
// Cập nhật feedback
feedbackRouter.put('/:id', validateToken, feedbackController.updateFeedback);

feedbackRouter.get('/coach/:id/average-rating', validateToken, feedbackController.getCoachAverageRating);

module.exports = feedbackRouter;