const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  joinDate: { type: Date, default: Date.now, index: true },
  membership: {
    plan: { type: Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
  }
}, {
    // Enable virtuals to be included in JSON responses
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for membership status
MemberSchema.virtual('membership.status').get(function() {
    return new Date() < this.membership.endDate ? 'Active' : 'Expired';
});

module.exports = mongoose.model('Member', MemberSchema);