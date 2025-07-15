const express = require('express');
const {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getFoods)
  .post(protect, authorize('admin'), createFood);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateFood)
  .delete(protect, authorize('admin'), deleteFood);

module.exports = router;
