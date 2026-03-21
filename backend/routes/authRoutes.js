const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController.js');
const upload = require('../middleware/uploadMiddleware.js');

const router = express.Router();

// Register Route
router.post('/register', registerUser);
// Login Route
router.post('/login', loginUser);
// Get User Info Route
router.get('/getUser', protect, getUserInfo);

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;