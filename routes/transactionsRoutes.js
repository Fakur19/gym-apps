const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

// @route   GET /api/transactions
// @desc    Get all transactions
router.get('/', transactionsController.getAllTransactions);

module.exports = router;