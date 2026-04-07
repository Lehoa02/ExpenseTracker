const xlsx = require("xlsx");
const Expense = require("../models/Expense.js");
const RecurringTransaction = require("../models/RecurringTransaction.js");
const { createRecurringTemplate, processRecurringTransactions, stopRecurringTemplate, normalizeToUserDay, buildNextOccurrence } = require("../services/recurringTransactionService.js");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


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
//Get All Scheduled Expenses
exports.getScheduledExpenses = async (req, res) => {
    const userId = req.user.id;

    try{
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const scheduledExpenses = await Expense.find({ userId, date: { $gt: today } }).sort({ date: 1});
        res.json(scheduledExpenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error'});
    }
};

exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try{
        await processRecurringTransactions().catch((error) => {
            console.error('Recurring expense backfill failed:', error);
        });

        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const expenses = await Expense.find({ userId, date: { $lte: today } }).sort({ date: -1});
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error'});
    }
}

//Update Expense Category
exports.updateExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const {
            icon,
            category,
            amount,
            date,
            timezone,
            isRecurring = false,
            frequency,
            scope = 'single',
            templateId,
        } = req.body;

        const parsedAmount = Number(amount);
        const recurringEnabled = isRecurring === true || isRecurring === 'true';
        const resolvedTimezone = timezone || 'UTC';

        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Amount should be a valid number greater than 0' });
        }

        if (recurringEnabled && !frequency) {
            return res.status(400).json({ message: 'Recurring frequency is required' });
        }

        const normalizedDate = normalizeToUserDay(date, resolvedTimezone);
        const shouldUpdateSequence = scope === 'sequence' && templateId;
        const recurringTemplate = shouldUpdateSequence
            ? await RecurringTransaction.findOne({ _id: templateId, userId, transactionType: 'expense' })
            : null;

        if (shouldUpdateSequence && !recurringTemplate) {
            return res.status(404).json({ message: 'Recurring expense sequence not found' });
        }

        const nextOccurrence = shouldUpdateSequence && recurringEnabled
            ? buildNextOccurrence(normalizedDate, frequency, resolvedTimezone)
            : null;

        if (shouldUpdateSequence && recurringEnabled && !nextOccurrence) {
            return res.status(400).json({ message: 'Unable to calculate next recurring occurrence' });
        }

        const updatePayload = {
            icon,
            category,
            amount: parsedAmount,
            date: normalizedDate,
            timezone: resolvedTimezone,
            isRecurring: recurringEnabled,
            recurrenceFrequency: recurringEnabled ? frequency : null,
            recurrenceStatus: recurringEnabled ? 'active' : 'none',
            recurringTemplateId: recurringEnabled ? templateId || null : shouldUpdateSequence ? templateId : null,
        };

        if (shouldUpdateSequence && !recurringEnabled) {
            updatePayload.recurrenceStatus = 'stopped';
            updatePayload.recurrenceFrequency = null;
            updatePayload.recurringTemplateId = templateId;
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId },
            updatePayload,
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (shouldUpdateSequence) {
            if (!recurringEnabled) {
                await stopRecurringTemplate({
                    templateId,
                    userId,
                    transactionType: 'expense',
                });
            } else {
                recurringTemplate.label = category;
                recurringTemplate.amount = parsedAmount;
                recurringTemplate.icon = icon;
                recurringTemplate.timezone = resolvedTimezone;
                recurringTemplate.frequency = frequency;
                recurringTemplate.startDate = normalizedDate;
                recurringTemplate.nextOccurrence = nextOccurrence;
                recurringTemplate.isActive = true;
                recurringTemplate.stoppedAt = null;
                await recurringTemplate.save();

                await Expense.updateMany(
                    { userId, recurringTemplateId: recurringTemplate._id },
                    {
                        $set: {
                            category,
                            amount: parsedAmount,
                            icon,
                            timezone: resolvedTimezone,
                            isRecurring: true,
                            recurrenceFrequency: frequency,
                            recurrenceStatus: 'active',
                            recurringTemplateId: recurringTemplate._id,
                        },
                    }
                );
            }
        }

        res.status(200).json(updatedExpense);
    } catch(error){
        res.status(500).json({ message: error.message || "Server Error"});
    }
};

//Delete Expense Category
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch(error) {
        res.status(500).json({message: "Server Error"})
    }
}

exports.deleteExpenseByCategory = async (req, res) => {
    try {
        const category = decodeURIComponent(req.params.category || '').trim();

        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const result = await Expense.deleteMany({
            userId: req.user.id,
            category: new RegExp(`^${escapeRegExp(category)}$`, 'i'),
        });

        res.json({
            message: 'Expense categories deleted successfully',
            deletedCount: result.deletedCount || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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