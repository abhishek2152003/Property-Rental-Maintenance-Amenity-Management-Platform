const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const User = require("../models/User")

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

module.exports = {
    register,
    login
}