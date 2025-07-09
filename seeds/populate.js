const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const Checkin = require('../models/Checkin');
const Transaction = require('../models/Transaction');

// CORRECTED: Use the environment variable from docker-compose,
// which points to the 'gym-db' service.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://gym-db:27017/gym_management';

const populateDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected for population script...');

        console.log('Deleting old data...');
        await Member.deleteMany({});
        await Checkin.deleteMany({});
        await Transaction.deleteMany({});
        console.log('Old data deleted.');

        const plans = await MembershipPlan.find({});
        if (plans.length === 0) {
            console.log('No membership plans found. Please seed plans first.');
            return;
        }

        console.log('Generating members and initial transactions...');

        for (let i = 0; i < 75; i++) { // Create 75 members
            const plan = faker.helpers.arrayElement(plans);
            const joinDate = faker.date.past({ months: 3 });
            
            let endDate;
            if (plan.durationInMonths === 0) {
                endDate = new Date(joinDate);
                endDate.setHours(23, 59, 59, 999);
            } else {
                endDate = new Date(joinDate);
                endDate.setMonth(endDate.getMonth() + plan.durationInMonths);
            }

            const memberData = {
                name: faker.person.fullName(),
                email: faker.internet.email({ provider: 'fake-mail.com' }),
                phone: faker.phone.number(),
                joinDate: joinDate,
                membership: {
                    plan: plan._id,
                    planName: plan.name,
                    price: plan.price,
                    startDate: joinDate,
                    endDate: endDate,
                }
            };
            
            const savedMember = await new Member(memberData).save();

            // Create initial transaction
            const newTransaction = new Transaction({
                member: savedMember._id,
                memberName: savedMember.name,
                planName: plan.name,
                amount: plan.price,
                transactionDate: joinDate,
            });
            await newTransaction.save();
        }
        console.log('Members and initial transactions created.');

        const allCreatedMembers = await Member.find({});

        console.log('Simulating daily check-ins for the last 90 days...');
        for (let i = 90; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const activeMembersOnThisDay = allCreatedMembers.filter(m => 
                date >= new Date(m.membership.startDate) && date <= new Date(m.membership.endDate)
            );

            if (activeMembersOnThisDay.length > 0) {
                const checkinCount = faker.number.int({ min: 5, max: Math.min(30, activeMembersOnThisDay.length) });
                const membersToCheckin = faker.helpers.arrayElements(activeMembersOnThisDay, checkinCount);

                for (const member of membersToCheckin) {
                    const checkin = new Checkin({
                        member: member._id,
                        memberName: member.name,
                        checkInTime: faker.date.between({ from: new Date(date).setHours(7,0,0), to: new Date(date).setHours(21,0,0) })
                    });
                    await checkin.save();
                }
            }
        }
        console.log('Check-in simulation complete.');

    } catch (error) {
        console.error('Error during population:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

populateDatabase();