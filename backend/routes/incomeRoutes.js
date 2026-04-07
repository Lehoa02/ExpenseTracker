const express = require('express');
const {
    addIncome,
    getAllIncome,
    getScheduledIncome,
    updateIncome,
    deleteIncome,
    deleteIncomeBySource,
    downloadIncomeExcel,
    stopRecurringIncome,
} = require("../controllers/incomeController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/scheduled/get", protect, getScheduledIncome);
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);
router.delete("/source/:source", protect, deleteIncomeBySource);
router.get("/download-excel", protect, downloadIncomeExcel);
router.patch("/recurring/:templateId/stop", protect, stopRecurringIncome);

module.exports = router;