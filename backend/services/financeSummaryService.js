const Expense = require("../models/Expense.js");
const Income = require("../models/Income.js");
const { Types } = require("mongoose");

const normalizeUserId = (userId) => new Types.ObjectId(String(userId));

const getUTCMonthKey = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

const buildMonthlyProfitSeries = (incomeByMonth = [], expenseByMonth = []) => {
    const incomeMap = new Map(incomeByMonth.map((item) => [item._id, item.total]));
    const expenseMap = new Map(expenseByMonth.map((item) => [item._id, item.total]));

    if (incomeMap.size === 0 && expenseMap.size === 0) {
        return [];
    }

    const monthKeys = [...new Set([...incomeMap.keys(), ...expenseMap.keys()])].sort();
    const selectedMonthKeys = monthKeys.slice(-12);
    const firstMonth = selectedMonthKeys[0];
    const lastMonth = selectedMonthKeys[selectedMonthKeys.length - 1];
    const useYearSuffix = firstMonth.slice(0, 4) !== lastMonth.slice(0, 4);

    return selectedMonthKeys.map((bucketKey) => {
        const [year, month] = bucketKey.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, 1));
        const income = incomeMap.get(bucketKey) || 0;
        const expense = expenseMap.get(bucketKey) || 0;

        return {
            bucketKey,
            month: date.toLocaleString("en-US", {
                month: "short",
                ...(useYearSuffix ? { year: "2-digit" } : {}),
                timeZone: "UTC",
            }),
            income,
            expense,
            profit: income - expense,
            total: income - expense,
        };
    });
};

const getFinanceSummary = async (userId) => {
    const userObjectId = normalizeUserId(userId);
    const currentMonthStart = new Date();
    currentMonthStart.setUTCDate(1);
    currentMonthStart.setUTCHours(0, 0, 0, 0);

    const rangeStart = new Date(Date.UTC(
        currentMonthStart.getUTCFullYear(),
        currentMonthStart.getUTCMonth() - 11,
        1,
    ));

    const [
        totalIncome,
        totalExpense,
        last60daysIncomeTransactions,
        last30daysExpenseTransactions,
        recentIncomeTransactions,
        recentExpenseTransactions,
        expenseByCategory,
        incomeBySource,
        incomeMonthlyTotals,
        expenseMonthlyTotals,
    ] = await Promise.all([
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
        Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: rangeStart },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: rangeStart },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);

    const last60daysTotalIncome = last60daysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const last30daysTotalExpense = last30daysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const profitByMonth = buildMonthlyProfitSeries(incomeMonthlyTotals, expenseMonthlyTotals);

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
        profitByMonth,
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