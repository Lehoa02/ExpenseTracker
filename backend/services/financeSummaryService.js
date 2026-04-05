const Expense = require("../models/Expense.js");
const Income = require("../models/Income.js");
const { Types } = require("mongoose");

const normalizeUserId = (userId) => new Types.ObjectId(String(userId));

const getUTCMonthKey = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

const parseMonthKey = (monthKey) => {
    const match = /^([0-9]{4})-([0-9]{2})$/.exec(monthKey || "");

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
        return null;
    }

    return { year, month };
};

const buildWeeklyBreakdown = (transactions = [], monthStart = new Date()) => {
    const daysInMonth = new Date(Date.UTC(
        monthStart.getUTCFullYear(),
        monthStart.getUTCMonth() + 1,
        0,
    )).getUTCDate();

    const weeks = Array.from({ length: 5 }, (_, index) => {
        const startDay = index * 7 + 1;
        const endDay = Math.min((index + 1) * 7, daysInMonth);
        const weekStart = new Date(Date.UTC(
            monthStart.getUTCFullYear(),
            monthStart.getUTCMonth(),
            startDay,
        ));
        const weekEnd = new Date(Date.UTC(
            monthStart.getUTCFullYear(),
            monthStart.getUTCMonth(),
            endDay,
        ));

        return {
            weekKey: `week-${index + 1}`,
            weekLabel: `Week ${index + 1}`,
            startDate: weekStart.toISOString(),
            endDate: weekEnd.toISOString(),
            rangeLabel: `${startDay}-${endDay}`,
            income: 0,
            expense: 0,
            profit: 0,
        };
    });

    transactions.forEach((transaction) => {
        if (!transaction?.date) {
            return;
        }

        const transactionDate = new Date(transaction.date);
        const dayOfMonth = transactionDate.getUTCDate();
        const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), weeks.length - 1);
        const week = weeks[weekIndex];

        if (!week) {
            return;
        }

        if (transaction.type === "income") {
            week.income += transaction.amount;
        } else {
            week.expense += transaction.amount;
        }
    });

    return weeks.map((week) => ({
        ...week,
        profit: week.income - week.expense,
    }));
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

const getMonthlyProfitBreakdown = async (userId, monthKey) => {
    const parsedMonth = parseMonthKey(monthKey);

    if (!parsedMonth) {
        const error = new Error("Invalid month key. Expected format YYYY-MM.");
        error.statusCode = 400;
        throw error;
    }

    const userObjectId = normalizeUserId(userId);
    const monthStart = new Date(Date.UTC(parsedMonth.year, parsedMonth.month - 1, 1));
    const monthEnd = new Date(Date.UTC(parsedMonth.year, parsedMonth.month, 1));
    const monthLabel = monthStart.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });

    const [incomeTransactions, expenseTransactions] = await Promise.all([
        Income.find({
            userId: userObjectId,
            date: { $gte: monthStart, $lt: monthEnd },
        }).sort({ date: 1 }),
        Expense.find({
            userId: userObjectId,
            date: { $gte: monthStart, $lt: monthEnd },
        }).sort({ date: 1 }),
    ]);

    const formattedTransactions = [
        ...incomeTransactions.map((transaction) => ({
            date: transaction.date,
            amount: transaction.amount,
            type: "income",
        })),
        ...expenseTransactions.map((transaction) => ({
            date: transaction.date,
            amount: transaction.amount,
            type: "expense",
        })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
        monthKey,
        monthLabel,
        totals: {
            income: totalIncome,
            expense: totalExpense,
            profit: totalIncome - totalExpense,
        },
        weeks: buildWeeklyBreakdown(formattedTransactions, monthStart),
    };
};

module.exports = {
    getFinanceSummary,
    getMonthlyProfitBreakdown,
};