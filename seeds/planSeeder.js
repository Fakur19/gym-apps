const MembershipPlan = require('../models/MembershipPlan');

// Add the two new single visit plans to this array
const plans = [
    { name: 'Single Visit - Regular', durationInMonths: 0, price: 25000 },
    { name: 'Single Visit - Student', durationInMonths: 0, price: 15000 },
    { name: 'Basic (1 Month)', durationInMonths: 1, price: 160000 },
    { name: 'Premium (3 Months)', durationInMonths: 3, price: 450000 },
    { name: 'VIP (12 Months)', durationInMonths: 12, price: 1800000 }
];

const seedPlans = async () => {
    try {
        // This will only run if the plans collection is empty,
        // so we need to delete the old plans first to see the change.
        // A better approach for the future would be a more robust migration system.
        const count = await MembershipPlan.countDocuments();
        if (count < 5) {
            // Simple way to re-seed if new plans are added.
            await MembershipPlan.deleteMany({});
            await MembershipPlan.insertMany(plans);
            console.log('Membership plans have been re-seeded');
        }
    } catch (error) {
        console.error('Error seeding membership plans:', error);
    }
};

module.exports = seedPlans;