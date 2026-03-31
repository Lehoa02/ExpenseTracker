const User = require('../models/User.js');

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

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

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    if (!passwordRules.test(newPassword)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword);

        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error changing password',
            error: error.message,
        });
    }
};