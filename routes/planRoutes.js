const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Existing route
router.get('/', planController.getAllPlans);

// === NEW ROUTES FOR MANAGING PLANS ===
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

module.exports = router;