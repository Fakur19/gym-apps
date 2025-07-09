const Transaction = require('../models/Transaction');

// Get all transactions, sorted by most recent
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};