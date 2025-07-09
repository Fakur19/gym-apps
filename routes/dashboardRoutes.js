const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// @route   GET api/dashboard/stats
// @desc    Get all dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;