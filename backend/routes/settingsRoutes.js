const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { updateProfile } = require('../controllers/settingsController.js');

const router = express.Router();

router.put('/update-profile', protect, updateProfile);

module.exports = router;