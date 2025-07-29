const Member = require('../models/Member');
const Checkin = require('../models/Checkin');
const Transaction = require('../models/Transaction');

// Helper function to generate chart data for a given range using aggregation
const getChartDataForRange = async (days) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const dateRange = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayLabel = days === 30
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : date.toLocaleDateString('en-US', { weekday: 'short' });
        dateRange.push({ date: date.toISOString().split('T')[0], dayLabel });
    }

    const [transactionsData, checkinsData] = await Promise.all([
        Transaction.aggregate([
            { $match: { transactionDate: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" } },
                    totalRevenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]),
        Checkin.aggregate([
            { $match: { checkInTime: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
    ]);

    const revenueMap = new Map(transactionsData.map(item => [item._id, item.totalRevenue]));
    const checkinsMap = new Map(checkinsData.map(item => [item._id, item.count]));

    return dateRange.map(day => ({
        day: day.dayLabel,
        revenue: revenueMap.get(day.date) || 0,
        checkins: checkinsMap.get(day.date) || 0
    }));
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