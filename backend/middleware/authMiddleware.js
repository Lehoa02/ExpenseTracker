const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};