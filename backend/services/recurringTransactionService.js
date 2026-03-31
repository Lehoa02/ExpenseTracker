const cron = require("node-cron");
const moment = require("moment-timezone");
const Income = require("../models/Income.js");
const Expense = require("../models/Expense.js");
const RecurringTransaction = require("../models/RecurringTransaction.js");

const VALID_FREQUENCIES = new Set(["daily", "weekly", "monthly", "yearly"]);

const getOccurrenceMoment = (date, timezone) => {
    const resolvedTimezone = timezone || "UTC";

    if (moment.isMoment(date)) {
        return date.clone().tz(resolvedTimezone).hour(12).minute(0).second(0).millisecond(0);
    }

    if (date instanceof Date) {
        return moment.tz(date, resolvedTimezone).hour(12).minute(0).second(0).millisecond(0);
    }

    return moment.tz(String(date), resolvedTimezone).hour(12).minute(0).second(0).millisecond(0);
};

const normalizeToUserDay = (date, timezone) => {
    return getOccurrenceMoment(date, timezone).toDate();
};

const buildNextOccurrence = (date, frequency, timezone) => {
    const nextDate = getOccurrenceMoment(date, timezone);

    if (!VALID_FREQUENCIES.has(frequency)) {
        return null;
    }

    switch (frequency) {
        case "daily":
            nextDate.add(1, "day");
            break;
        case "weekly":
            nextDate.add(7, "days");
            break;
        case "monthly":
            nextDate.add(1, "month");
            break;
        case "yearly":
            nextDate.add(1, "year");
            break;
        default:
            return null;
    }

    return nextDate.toDate();
};

const createRecurringTemplate = async ({
    userId,
    transactionType,
    label,
    amount,
    icon,
    startDate,
    frequency,
    timezone,
}) => {
    if (!VALID_FREQUENCIES.has(frequency)) {
        throw new Error("Invalid recurrence frequency");
    }

    const resolvedTimezone = timezone || "UTC";
    const initialDate = normalizeToUserDay(startDate, resolvedTimezone);
    const nextOccurrence = buildNextOccurrence(initialDate, frequency, resolvedTimezone);

    if (!nextOccurrence) {
        throw new Error("Unable to calculate next occurrence");
    }

    return RecurringTransaction.create({
        userId,
        transactionType,
        label,
        amount,
        icon,
        timezone: resolvedTimezone,
        frequency,
        startDate: initialDate,
        nextOccurrence,
        isActive: true,
    });
};

const createRecurringInstance = async (template, occurrenceDate) => {
    const normalizedOccurrenceDate = normalizeToUserDay(occurrenceDate, template.timezone);

    const sharedFields = {
        userId: template.userId,
        icon: template.icon,
        amount: template.amount,
        date: normalizedOccurrenceDate,
        timezone: template.timezone,
        isRecurring: true,
        recurringTemplateId: template._id,
        recurrenceFrequency: template.frequency,
        recurrenceStatus: "active",
    };

    if (template.transactionType === "income") {
        return Income.create({
            ...sharedFields,
            source: template.label,
        });
    }

    return Expense.create({
        ...sharedFields,
        category: template.label,
    });
};

const processRecurringTransactions = async () => {
    const templates = await RecurringTransaction.find({ isActive: true });

    for (const template of templates) {
        const now = template.timezone ? moment.tz(template.timezone) : moment.utc();
        const currentDayEnd = now.clone().endOf("day").toDate();
        let nextOccurrence = new Date(template.nextOccurrence);

        while (template.isActive && nextOccurrence <= currentDayEnd) {
            await createRecurringInstance(template, nextOccurrence);
            nextOccurrence = buildNextOccurrence(nextOccurrence, template.frequency, template.timezone);

            if (!nextOccurrence) {
                break;
            }

            template.nextOccurrence = nextOccurrence;
            template.lastProcessedAt = new Date();
        }

        await template.save();
    }
};

const stopRecurringTemplate = async ({ templateId, userId, transactionType }) => {
    const template = await RecurringTransaction.findOne({
        _id: templateId,
        userId,
        transactionType,
    });

    if (!template) {
        return null;
    }

    template.isActive = false;
    template.stoppedAt = new Date();
    await template.save();

    const transactionModel = transactionType === "income" ? Income : Expense;

    await transactionModel.updateMany(
        { userId, recurringTemplateId: template._id },
        { recurrenceStatus: "stopped" }
    );

    return template;
};

const startRecurringTransactionProcessor = () => {
    cron.schedule("* * * * *", () => {
        processRecurringTransactions().catch((error) => {
            console.error("Recurring transaction processor failed:", error);
        });
    });

    processRecurringTransactions().catch((error) => {
        console.error("Recurring transaction processor bootstrap failed:", error);
    });
};

module.exports = {
    buildNextOccurrence,
    createRecurringTemplate,
    processRecurringTransactions,
    normalizeToUserDay,
    startRecurringTransactionProcessor,
    stopRecurringTemplate,
};
