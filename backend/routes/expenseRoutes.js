const express = require("express");
const { addExpense, getAllExpenses, getScheduledExpenses, updateExpense, deleteExpense, deleteExpenseByCategory, downloadExpenseExcel, stopRecurringExpense } = require("../controllers/expenseController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.get("/scheduled/get", protect, getScheduledExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.delete("/category/:category", protect, deleteExpenseByCategory);
router.get("/download-excel", protect, downloadExpenseExcel);
router.patch("/recurring/:templateId/stop", protect, stopRecurringExpense);

module.exports = router;
