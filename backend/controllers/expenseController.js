const xlsx = require("xlsx");
const Expense = require("../models/Expense.js");


//Add Expense Category
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, category, amount, date} = req.body;
        
        if(!category || !amount || !date) {
            return res.status(400).json({ message: " All fields are required"});
        }

        const newExpense = Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json({ newExpense });
    } catch(error){
        res.status(500).json({ message: "Server Error"});
    }
};

//Get All Expense Categories
exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try{
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