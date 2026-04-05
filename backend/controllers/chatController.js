const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getFinanceSummary } = require("../services/financeSummaryService.js");

const buildConversationText = (history = []) => {
    return history
        .filter((entry) => entry?.role && entry?.content)
        .slice(-6)
        .map((entry) => `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.content}`)
        .join("\n");
};

const buildAiFinanceSummary = (financeSummary) => {
    const recentTransactions = Array.isArray(financeSummary?.recentTransactions)
        ? financeSummary.recentTransactions.slice(0, 5).map((transaction) => ({
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category || null,
            source: transaction.source || null,
        }))
        : [];

    return {
        totalBalance: financeSummary?.totalBalance || 0,
        totalIncome: financeSummary?.totalIncome || 0,
        totalExpense: financeSummary?.totalExpense || 0,
        last30daysExpenseTotal: financeSummary?.last30daysExpenseTransactions?.total || 0,
        last60daysIncomeTotal: financeSummary?.last60daysIncomeTransactions?.total || 0,
        expenseByCategory: Array.isArray(financeSummary?.expenseByCategory)
            ? financeSummary.expenseByCategory.slice(0, 5)
            : [],
        incomeBySource: Array.isArray(financeSummary?.incomeBySource)
            ? financeSummary.incomeBySource.slice(0, 5)
            : [],
        profitByMonth: Array.isArray(financeSummary?.profitByMonth)
            ? financeSummary.profitByMonth.slice(-6)
            : [],
        recentTransactions,
    };
};

const normalizeReply = (text = "") => {
    return String(text)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^\s*[-•]\s+/gm, "- ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

exports.sendMessage = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(503).json({ message: "GEMINI_API_KEY is not configured on the server." });
        }

        const message = String(req.body?.message || "").trim();
        const history = Array.isArray(req.body?.history) ? req.body.history : [];

        if (!message) {
            return res.status(400).json({ message: "Message is required." });
        }

        const financeSummary = buildAiFinanceSummary(await getFinanceSummary(req.user.id));
        const conversationText = buildConversationText(history);

        const prompt = [
            "You are a careful, practical personal finance assistant inside an expense tracker app.",
            "Use the user's financial summary to answer the question.",
            "Be concise, specific, and action-oriented.",
            "Write in plain text only. Do not use markdown, bullet symbols, bold text, or numbered lists.",
            "Use short paragraphs and simple sentences.",
            "Separate ideas into 2-4 short paragraphs with a blank line between them.",
            "Each paragraph should contain at most 2 sentences.",
            "Do not claim to be a licensed financial advisor.",
            "If the data is insufficient, say what is missing and ask a clarifying question.",
            "Avoid generic advice unless it is directly tied to the user's spending or income patterns.",
            "",
            "Financial summary JSON:",
            JSON.stringify(financeSummary, null, 2),
            conversationText ? "" : null,
            conversationText ? "Recent conversation:" : null,
            conversationText || null,
            "",
            `User question: ${message}`,
        ].filter(Boolean).join("\n");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const rawReply = result?.response?.text?.();

        if (!rawReply) {
            return res.status(502).json({
                message: "The assistant could not generate a response right now.",
            });
        }

        const reply = normalizeReply(rawReply);

        res.json({
            reply,
        });
    } catch (error) {
        console.error("Gemini chat error:", error);
        res.status(500).json({
            message: "Failed to generate a response.",
            error: error.message,
        });
    }
};