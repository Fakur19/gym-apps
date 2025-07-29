const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  items: [
    {
      food: {
        type: mongoose.Schema.ObjectId,
        ref: 'Food',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
