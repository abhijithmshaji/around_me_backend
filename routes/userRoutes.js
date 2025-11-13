import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { authorizeRoles, verifyToken } from "../middleware/auth-middleware.js";

dotenv.config();
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const allowedRoles = ["general", "manager"];
        const userRole = allowedRoles.includes(role) ? role : "general";

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: userRole });

        res.status(201).json({
            message: "User registered successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, global.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/', verifyToken, async (req, res) => {
    console.log('inside users');

    const users = await User.find().select("-password");
    res.send(users)
})

router.post('/', async (req, res) => {

})

export default router;
