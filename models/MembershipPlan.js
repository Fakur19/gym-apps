const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipPlanSchema = new Schema({
    name: { type: String, required: true, unique: true },
    durationInMonths: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('MembershipPlan', MembershipPlanSchema);