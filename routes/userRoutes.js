import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import { addToWishlist, removeFromWishlist, getUserById } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";
import { uploadProfile } from "../middleware/uploadProfile.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: ["general", "manager"].includes(role) ? role : "general",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // SIGN TOKEN WITH ENV SECRET
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, wishList: [user.wishlist] },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/update-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate current password
    const validPass = await bcrypt.compare(currentPassword, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Save new hashed password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated", user });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

router.post("/update-email", verifyToken, async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate current password
    
    if (currentEmail === newEmail) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Save new hashed password
    user.email = newEmail;
    await user.save();

    res.json({ message: "Password updated", user });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});



// PROTECTED ROUTES
router.post("/wishlist/:eventId", verifyToken, addToWishlist);
router.delete("/wishlist/:eventId", verifyToken, removeFromWishlist);

router.put(
  "/profile",
  verifyToken,
  uploadProfile.single("profileImage"),
  updateProfile
);
router.get("/:id", verifyToken, getUserById);

export default router;
