const Expense = require("../models/Expense.js");
const Income = require("../models/Income.js");
const { Types } = require("mongoose");

const normalizeUserId = (userId) => new Types.ObjectId(String(userId));

const getFinanceSummary = async (userId) => {
    const userObjectId = normalizeUserId(userId);

    const [totalIncome, totalExpense, last60daysIncomeTransactions, last30daysExpenseTransactions, recentIncomeTransactions, recentExpenseTransactions, expenseByCategory, incomeBySource] = await Promise.all([
        Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 }),
        Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 }),
        Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5),
        Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5),
        Expense.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: { $ifNull: ["$category", "Uncategorized"] },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 8 },
        ]),
        Income.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: { $ifNull: ["$source", "Income"] },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 8 },
        ]),
    ]);

    const last60daysTotalIncome = last60daysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const last30daysTotalExpense = last30daysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const recentTransactions = [
        ...recentIncomeTransactions.map((transaction) => ({
            ...transaction.toObject(),
            type: "income",
        })),
        ...recentExpenseTransactions.map((transaction) => ({
            ...transaction.toObject(),
            type: "expense",
        })),
    ].sort((a, b) => b.date - a.date);

    return {
        totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
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
        recentTransactions,
        expenseByCategory: expenseByCategory.map((item) => ({
            category: item._id,
            total: item.total,
        })),
        incomeBySource: incomeBySource.map((item) => ({
            source: item._id,
            total: item.total,
        })),
    };
};

module.exports = {
    getFinanceSummary,
};