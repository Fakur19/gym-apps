const Member = require('../models/Member');
const Checkin = require('../models/Checkin');
const Transaction = require('../models/Transaction');

// Helper function to generate chart data for a given range
const getChartDataForRange = async (days) => {
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const dayLabel = days === 30
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : date.toLocaleDateString('en-US', { weekday: 'short' });
        const dailyRevenue = (await Transaction.find({ transactionDate: { $gte: dayStart, $lt: dayEnd } }))
            .reduce((sum, t) => sum + t.amount, 0);
        const dailyCheckins = await Checkin.countDocuments({ checkInTime: { $gte: dayStart, $lt: dayEnd } });
        chartData.push({ day: dayLabel, revenue: dailyRevenue, checkins: dailyCheckins });
    }
    return chartData;
};

// Get all dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // --- KPI Cards & Expiring List ---
        const [todaysTransactions, todaysCheckinsCount, activeMembersCount, newMembersTodayCount, expiringSoonMembers] = await Promise.all([
            Transaction.find({ transactionDate: { $gte: today, $lt: tomorrow } }),
            Checkin.countDocuments({ checkInTime: { $gte: today, $lt: tomorrow } }),
            Member.countDocuments({ 'membership.endDate': { $gte: new Date() } }),
            Member.countDocuments({ joinDate: { $gte: today, $lt: tomorrow } }),
            Member.find({ 'membership.endDate': { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 7)) } }).sort({ 'membership.endDate': 'asc' })
        ]);
        const todaysRevenue = todaysTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // --- Chart Data ---
        const [weeklyData, monthlyData] = await Promise.all([
            getChartDataForRange(7),
            getChartDataForRange(30)
        ]);

        // === NEW: Busiest Hours Calculation ===
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const busiestHoursData = await Checkin.aggregate([
            // 1. Filter check-ins from the last 30 days
            { $match: { checkInTime: { $gte: last30Days } } },
            // 2. Extract the hour from the checkInTime (adjusting for timezone if necessary)
            { $project: { hour: { $hour: { date: "$checkInTime", timezone: "Asia/Jakarta" } } } },
            // 3. Group by the hour and count occurrences
            { $group: { _id: "$hour", count: { $sum: 1 } } },
            // 4. Sort by the hour
            { $sort: { _id: 1 } }
        ]);
        // =====================================

        res.json({
            kpi: {
                todaysRevenue,
                todaysCheckins: todaysCheckinsCount,
                activeMembers: activeMembersCount,
                newMembersToday: newMembersTodayCount,
            },
            expiringSoon: expiringSoonMembers,
            charts: {
                weeklyData,
                monthlyData,
                busiestHours: busiestHoursData // Add new data to the response
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};