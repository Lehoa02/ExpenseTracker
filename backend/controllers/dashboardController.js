const { getFinanceSummary, getMonthlyProfitBreakdown } = require("../services/financeSummaryService.js");
const { processRecurringTransactions } = require("../services/recurringTransactionService.js");

exports.getDashboardData = async (req, res) => {
    try{
        await processRecurringTransactions().catch((error) => {
            console.error('Recurring dashboard backfill failed:', error);
        });

        const summary = await getFinanceSummary(req.user.id);

        res.json({
            ...summary,
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
};

exports.getDashboardProfitBreakdown = async (req, res) => {
    try {
        const { month } = req.query;
        const breakdown = await getMonthlyProfitBreakdown(req.user.id, month);

        res.json(breakdown);
    } catch (error) {
        console.error("Dashboard Monthly Breakdown API Error:", error);
        res.status(error.statusCode || 500).json({
            message: error.statusCode === 400 ? error.message : "Error fetching monthly profit breakdown",
            error: error.message,
        });
    }
};


//Prev Version:

/*
const Expense = require("../models/Expense.js");
const Income = require("../models/Income.js");
const {isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try{
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //Fetch total income & expenses
        const totalIncome = await Income.aggregate([
            {$match: {userId: userObjectId}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        console.log("Total Income:", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            {$match: {userId: userObjectId}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        console.log("Total Expense:", {totalExpense, userId: isValidObjectId(userId)});

        //Get income transactions for the last 60 days
        const last60daysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        //Get total income for the last 60 days
        const last60daysTotalIncome = last60daysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0);

        //Get expense transactions for the last 30 days
        const last30daysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        //Get total expense for the last 30 days
        const last30daysTotalExpense = last30daysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0);

        //Fetch last 5 transactions (both income and expenses)
        const lastTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (transaction) => ({
                    ...transaction.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (transaction) => ({
                    ...transaction.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); //sort last to first

        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30daysExpenseTransactions: {
                total: last30daysTotalExpense,
                transactions: last30daysExpenseTransactions,
            },
            last60daysIncomeTransactions: {
                total: last60daysTotalIncome,
                transactions: last60daysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
};
*/