const Checkin = require('../models/Checkin');
const Member = require('../models/Member');

// Create a new check-in
exports.createCheckin = async (req, res) => {
    try {
        const { memberId } = req.body;
        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found.' });
        }

        // Check if membership is active
        if (member.membership.status !== 'Active') {
            return res.status(400).json({ msg: 'Membership is expired. Please renew.' });
        }

        const newCheckin = new Checkin({
            member: memberId,
            memberName: member.name
        });

        await newCheckin.save();
        
        const populatedCheckin = await Checkin.findById(newCheckin._id).populate('member', 'name');
        
        res.status(201).json(populatedCheckin);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all check-ins for today
exports.getTodaysCheckins = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const checkins = await Checkin.find({
            checkInTime: {
                $gte: today,
                $lt: tomorrow
            }
        }).sort({ checkInTime: -1 }); // Show most recent first

        res.json(checkins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};