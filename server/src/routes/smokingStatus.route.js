const express = require('express');
const statusRouter = express.Router();
const smokingStatusController = require('../controllers/smokingStatus.controller');
const { validateToken, checkRole } = require('../middlewares/authMiddleware');

statusRouter.post('/:id', validateToken, checkRole(['user']), smokingStatusController.createSmokingStatus);
statusRouter.put('/:id', validateToken, checkRole(['user']), smokingStatusController.updateSmokingStatus);
statusRouter.get('/:id', validateToken, checkRole(['user']), smokingStatusController.getStatusBysUserId);

module.exports = statusRouter;