const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { sendMessage } = require("../controllers/chatController.js");

const router = express.Router();

router.post("/message", protect, sendMessage);

module.exports = router;