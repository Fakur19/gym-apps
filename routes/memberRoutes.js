const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Existing routes
router.post('/', memberController.addMember);
router.get('/', memberController.getAllMembers);
router.put('/:id/renew', memberController.renewMember);

// === NEW ROUTE FOR EDITING A MEMBER ===
router.put('/:id', memberController.updateMember);

module.exports = router;