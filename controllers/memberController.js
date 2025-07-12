const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const Transaction = require('../models/Transaction'); // New
// Add a new member
exports.addMember = async (req, res) => {
  try {
    const { name, phone, planId } = req.body;
    let { email } = req.body;

    // Ensure sparse index works correctly by converting empty email string to null
    if (email === '') {
      email = undefined;
    }

    if (!name || !phone || !planId) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
        return res.status(404).json({ msg: 'Membership plan not found' });
    }

    const startDate = new Date();
    let endDate;

    // --- NEW LOGIC for single visit ---
    if (plan.durationInMonths === 0) {
        // For single visits, membership ends at the end of the current day
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
    } else {
        // For monthly plans
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.durationInMonths);
    }
    // --- END of new logic ---

    const newMember = new Member({
      name,
      email,
      phone,
      membership: {
        plan: plan._id,
        planName: plan.name,
        price: plan.price,
        startDate,
        endDate,
      }
    });

    const savedMember = await newMember.save();

    // Create a transaction record
    const newTransaction = new Transaction({
        member: savedMember._id,
        memberName: savedMember.name,
        planName: plan.name,
        amount: plan.price
    });
    await newTransaction.save();
    
    res.status(201).json(savedMember);

  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
        let message;
        if (err.message.includes('email')) {
            message = 'A member with this email already exists.';
        } else if (err.message.includes('phone')) {
            message = 'A member with this phone number already exists.';
        } else {
            message = 'A member with this value already exists.';
        }
        return res.status(400).json({ msg: message });
    }
    res.status(500).send('Server Error');
  }
};

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ joinDate: -1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Renew a member's membership
exports.renewMember = async (req, res) => {
    try {
        const { planId } = req.body;
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        const plan = await MembershipPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ msg: 'Membership plan not found' });
        }

        let startDate;
        let newEndDate;

        // --- NEW LOGIC for single visit renewal ---
        if (plan.durationInMonths === 0) {
            // A single visit pass is always for the current day
            startDate = new Date();
            newEndDate = new Date();
            newEndDate.setHours(23, 59, 59, 999);
        } else {
            // Standard renewal logic for monthly plans
            const now = new Date();
            const currentEndDate = new Date(member.membership.endDate);
            startDate = now > currentEndDate ? now : currentEndDate;
            newEndDate = new Date(startDate);
            newEndDate.setMonth(newEndDate.getMonth() + plan.durationInMonths);
        }
        // --- END of new logic ---

        member.membership.plan = plan._id;
        member.membership.planName = plan.name;
        member.membership.price = plan.price;
        member.membership.startDate = startDate;
        member.membership.endDate = newEndDate;

        const updatedMember = await member.save();

        // Create a transaction record
        const newTransaction = new Transaction({
            member: updatedMember._id,
            memberName: updatedMember.name,
            planName: plan.name,
            amount: plan.price
        });
        await newTransaction.save();


        res.json(updatedMember);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === NEW FUNCTION TO UPDATE MEMBER DETAILS ===
exports.updateMember = async (req, res) => {
    try {
        const { name, phone } = req.body;
        let { email } = req.body;
        const memberId = req.params.id;

        // Basic validation
        if (!name || !phone) {
            return res.status(400).json({ msg: 'Name and phone number are required.' });
        }

        // Ensure sparse index works correctly by converting empty email string to null
        if (email === '') {
            email = undefined;
        }

        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ msg: 'Member not found.' });
        }

        member.name = name;
        member.email = email;
        member.phone = phone;

        const updatedMember = await member.save();
        res.json(updatedMember);

    } catch (err) {
        console.error(err.message);
        // Handle duplicate key errors from the database
        if (err.code === 11000) {
            let message;
            if (err.message.includes('email')) {
                message = 'This email is already in use by another member.';
            } else if (err.message.includes('phone')) {
                message = 'This phone number is already in use by another member.';
            } else {
                message = 'A member with this value already exists.';
            }
            return res.status(400).json({ msg: message });
        }
        res.status(500).send('Server Error');
    }
};