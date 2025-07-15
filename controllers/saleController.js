const Sale = require('../models/Sale');
const Food = require('../models/Food');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res, next) => {
  const { items } = req.body;

  try {
    let total = 0;
    const saleItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ success: false, error: `Food not found with id of ${item.foodId}` });
      }
      if (food.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Not enough stock for ${food.name}` });
      }

      total += food.price * item.quantity;
      saleItems.push({
        food: item.foodId,
        quantity: item.quantity,
        price: food.price,
      });

      food.stock -= item.quantity;
      await food.save();
    }

    const sale = await Sale.create({
      items: saleItems,
      total,
    });

    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find().populate('items.food', 'name price');
    res.status(200).json({ success: true, data: sales });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
