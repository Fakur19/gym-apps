const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

// @route   POST api/checkins
// @desc    Check in a member
router.post('/', checkinController.createCheckin);

// @route   GET api/checkins/today
// @desc    Get all check-ins for the current day
router.get('/today', checkinController.getTodaysCheckins);

module.exports = router;