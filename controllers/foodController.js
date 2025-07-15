const Food = require('../models/Food');

// @desc    Get all food items
// @route   GET /api/foods
// @access  Private
exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.status(200).json({ success: true, data: foods });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private (Admin only)
exports.createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private (Admin only)
exports.updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: food });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private (Admin only)
exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
