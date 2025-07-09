const MembershipPlan = require('../models/MembershipPlan');

// Get all membership plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find().sort({ price: 'asc' });
        res.json(plans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === NEW FUNCTION: Create a membership plan ===
exports.createPlan = async (req, res) => {
    try {
        const { name, durationInMonths, price } = req.body;
        if (!name || durationInMonths === undefined || !price) {
            return res.status(400).json({ msg: 'Please provide name, duration, and price.' });
        }
        const newPlan = new MembershipPlan({ name, durationInMonths, price });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === NEW FUNCTION: Update a membership plan ===
exports.updatePlan = async (req, res) => {
    try {
        const { name, durationInMonths, price } = req.body;
        const updatedPlan = await MembershipPlan.findByIdAndUpdate(
            req.params.id,
            { name, durationInMonths, price },
            { new: true }
        );
        if (!updatedPlan) {
            return res.status(404).json({ msg: 'Plan not found.' });
        }
        res.json(updatedPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === NEW FUNCTION: Delete a membership plan ===
exports.deletePlan = async (req, res) => {
    try {
        const deletedPlan = await MembershipPlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({ msg: 'Plan not found.' });
        }
        res.json({ msg: 'Plan deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};