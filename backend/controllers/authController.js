const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

//Register User
 exports.registerUser = async (req, res) => {
    //Validation: Check if body exists
     if (!req.body || Object.keys(req.body).length === 0) {
         return res.status(400).json({ message: 'Please fill in all required fields' });
     }

    const { fullName, email, password, profilePhoto } = req.body;

    //Validation: Check missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        //Create new user
        const newUser = new User({
            fullName,
            email,
            password,
            profilePhoto
        });

        //Save user to database
        await newUser.save();

        res.status(201).json({
            id:newUser._id,
            user: newUser,
            token: generateToken(newUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
    // Implementation for user login
};

//Get User Info
exports.getUserInfo = async (req, res) => {
    // Implementation for getting user info
};
;