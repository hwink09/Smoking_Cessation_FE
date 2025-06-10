const express = require('express');
const badgeController = require('../controllers/badge.controller');
const badgeRouter = express.Router();
const { validateToken, checkRole } = require('../middlewares/authMiddleware');

badgeRouter.put('/:id', validateToken, checkRole(['admin', 'coach']), badgeController.updateBadge);
badgeRouter.delete('/:id', validateToken, checkRole(['admin', 'coach']), badgeController.deleteBadge);
badgeRouter.post('/create', validateToken, checkRole(['admin', 'coach']), badgeController.createBadge);
badgeRouter.get('/', validateToken, checkRole(['admin', 'coach']), badgeController.getAllBadges);

module.exports = badgeRouter;