import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from './routes/eventRoutes.js'
const JWT_SECRET = "mySuperSecretKey123";
global.JWT_SECRET = JWT_SECRET;

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use('/uploads', express.static('uploads')); // serve images
app.use('/api/events', eventRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/around_me")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
