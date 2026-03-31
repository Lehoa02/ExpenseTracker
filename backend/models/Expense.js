const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    icon: { type: String},
    category: {type: String, required: true}, //Example: Food, Gas
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    timezone: { type: String, default: null },
    isRecurring: { type: Boolean, default: false },
    recurringTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "RecurringTransaction", default: null },
    recurrenceFrequency: { type: String, default: null },
    recurrenceStatus: { type: String, default: "none" },
}, {timestamps: true});

module.exports = mongoose.model("Expense", ExpenseSchema);