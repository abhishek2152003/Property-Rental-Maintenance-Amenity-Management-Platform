const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword, role })
        await newUser.save();

        res.status(201).json({ message: `User registered with username ${username}` })

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Something went wrong" })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = generateToken(user._id, user.role)
        res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" })
    }

};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        
        // Hash token and save to user
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with reset link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'PropFlow Password Reset Token',
                message: message
            });

            res.status(200).json({ 
                message: "Password reset link sent to email",
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}