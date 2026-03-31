const xlsx = require("xlsx");
const Expense = require("../models/Expense.js");
const { createRecurringTemplate, processRecurringTransactions, stopRecurringTemplate, normalizeToUserDay } = require("../services/recurringTransactionService.js");


//Add Expense Category
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, category, amount, date, timezone, isRecurring = false, frequency } = req.body;
        const parsedAmount = Number(amount);
        const recurringEnabled = isRecurring === true || isRecurring === 'true';
        const resolvedTimezone = timezone || 'UTC';
        
        if(!category || !amount || !date) {
            return res.status(400).json({ message: " All fields are required"});
        }

        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Amount should be a valid number greater than 0"});
        }

        if (recurringEnabled && !frequency) {
            return res.status(400).json({ message: "Recurring frequency is required"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount: parsedAmount,
            date: normalizeToUserDay(date, resolvedTimezone),
            timezone: resolvedTimezone,
            isRecurring: recurringEnabled,
            recurrenceFrequency: recurringEnabled ? frequency : null,
            recurrenceStatus: recurringEnabled ? 'active' : 'none',
        });

        await newExpense.save();
        if (recurringEnabled) {
            try {
                const recurringTemplate = await createRecurringTemplate({
                    userId,
                    transactionType: 'expense',
                    label: category,
                    amount: parsedAmount,
                    icon,
                    startDate: date,
                    frequency,
                    timezone: resolvedTimezone,
                });

                newExpense.recurringTemplateId = recurringTemplate._id;
                await newExpense.save();
            } catch (recurringError) {
                await Expense.findByIdAndDelete(newExpense._id);
                throw recurringError;
            }
        }
        res.status(200).json({ newExpense });
    } catch(error){
        res.status(500).json({ message: error.message || "Server Error"});
    }
};

//Get All Expense Categories
exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try{
        await processRecurringTransactions().catch((error) => {
            console.error('Recurring expense backfill failed:', error);
        });

        const expenses = await Expense.find({ userId }).sort({ date: -1});
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error'});
    }
}

//Delete Expense Category
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch(error) {
        res.status(500).json({message: "Server Error"})
    }
}

exports.stopRecurringExpense = async (req, res) => {
    try {
        const template = await stopRecurringTemplate({
            templateId: req.params.templateId,
            userId: req.user.id,
            transactionType: 'expense',
        });

        if (!template) {
            return res.status(404).json({ message: 'Recurring expense sequence not found' });
        }

        res.json({ message: 'Recurring expense sequence stopped successfully' });
    } catch (error) {
        res.status(500).json({ message: "Server Error"});
    }
}

//Download Expense Category
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const expenses = await Expense.find({ userId }).sort({ date: -1});

        //Prepare data for Excel
        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx.writeFile(wb, "expenses_details.xlsx");
        res.download("expenses_details.xlsx");
    } catch(error) {
        res.status(500).json({message: "Server Error"});
    }
}