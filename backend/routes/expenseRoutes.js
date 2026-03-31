const express = require("express");
const { addExpense, getAllExpenses, deleteExpense, downloadExpenseExcel, stopRecurringExpense } = require("../controllers/expenseController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.delete("/:id", protect, deleteExpense);
router.get("/download-excel", protect, downloadExpenseExcel);
router.patch("/recurring/:templateId/stop", protect, stopRecurringExpense);

module.exports = router;

