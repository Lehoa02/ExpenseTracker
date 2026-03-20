const express = require('express');


const { registerUser, loginUser, getUserInfo } = require('../controllers/authController.js');

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Get User Info Route
//router.get('/getUser', protect, getUserInfo);

module.exports = router;