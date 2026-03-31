const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { updateProfile, changePassword } = require('../controllers/settingsController.js');

const router = express.Router();

router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;