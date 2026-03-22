const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

//Register User
 exports.registerUser = async (req, res) => {
    //Validation: Check if body exists
    //  if (!req.body || Object.keys(req.body).length === 0) {
    //      return res.status(400).json({ message: 'Please fill in all required fields' });
    //  }

    const { fullName, email, password, profileImageUrl } = req.body;

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
            profilePhoto: profileImageUrl
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
    const { email, password } = req.body;

    //Validation: Check missing fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        //Check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            id: user._id,
            user: user,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

//Get User Info
exports.getUserInfo = async (req, res) => {
   try{
    const user = await User.findById(req.user.id).select('-password');

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
   } catch (error) {
    res.status(500).json({ message: 'Error fetching user info', error: error.message });
   }
};
