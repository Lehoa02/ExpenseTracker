const User = require('../models/User.js');

exports.updateProfile = async (req, res) => {
    const { fullName, profilePhoto } = req.body;

    if (typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                fullName: fullName.trim(),
                profilePhoto: typeof profilePhoto === 'string' ? profilePhoto : '',
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating profile',
            error: error.message,
        });
    }
};