const mongoose = require("mongoose");

const RecurringTransactionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        transactionType: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        label: { type: String, required: true },
        amount: { type: Number, required: true },
        icon: { type: String },
        timezone: { type: String, default: null },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
            required: true,
        },
        startDate: { type: Date, required: true },
        nextOccurrence: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        lastProcessedAt: { type: Date, default: null },
        stoppedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RecurringTransaction", RecurringTransactionSchema);
