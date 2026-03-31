const xlsx = require('xlsx');
const Income = require('../models/Income.js');
const { createRecurringTemplate, processRecurringTransactions, stopRecurringTemplate, normalizeToUserDay } = require('../services/recurringTransactionService.js');



//Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, source, amount, date, timezone, isRecurring = false, frequency } = req.body;
        const parsedAmount = Number(amount);
        const recurringEnabled = isRecurring === true || isRecurring === 'true';
        const resolvedTimezone = timezone || 'UTC';

        //Validation: Check missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Amount should be a valid number greater than 0' });
        }

        if (recurringEnabled && !frequency) {
            return res.status(400).json({ message: 'Recurring frequency is required' });
        }
        
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount: parsedAmount,
            date: normalizeToUserDay(date, resolvedTimezone),
            timezone: resolvedTimezone,
            isRecurring: recurringEnabled,
            recurrenceFrequency: recurringEnabled ? frequency : null,
            recurrenceStatus: recurringEnabled ? 'active' : 'none',
        });

        await newIncome.save();

        if (recurringEnabled) {
            try {
                const recurringTemplate = await createRecurringTemplate({
                    userId,
                    transactionType: 'income',
                    label: source,
                    amount: parsedAmount,
                    icon,
                    startDate: date,
                    frequency,
                    timezone: resolvedTimezone,
                });

                newIncome.recurringTemplateId = recurringTemplate._id;
                await newIncome.save();
            } catch (recurringError) {
                await Income.findByIdAndDelete(newIncome._id);
                throw recurringError;
            }
        }
        res.status(200).json(newIncome);
    } catch(error){
        res.status(500).json({ message: error.message || 'Server Error'});
    }
};

//Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        await processRecurringTransactions().catch((error) => {
            console.error('Recurring income backfill failed:', error);
        });

        const income = await Income.find({ userId }).sort({ date: -1});
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: 'Server Error'});
    }
};

//Delete Income Source
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: 'Income deleted successfully' });
    } catch(error) {
        res.status(500).json({message: "Server Error"})
    }
};

exports.stopRecurringIncome = async (req, res) => {
    try {
        const template = await stopRecurringTemplate({
            templateId: req.params.templateId,
            userId: req.user.id,
            transactionType: 'income',
        });

        if (!template) {
            return res.status(404).json({ message: 'Recurring income sequence not found' });
        }

        res.json({ message: 'Recurring income sequence stopped successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//Download Income Source
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({ userId }).sort({ date: -1});

        //Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch(error) {
        res.status(500).json({message: "Server Error"});
    }
};

