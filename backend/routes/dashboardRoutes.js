const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { getDashboardData, getDashboardProfitBreakdown } = require("../controllers/dashboardController.js");

const router = express.Router();

router.get("/", protect, getDashboardData);
router.get("/profit-breakdown", protect, getDashboardProfitBreakdown);

module.exports = router;