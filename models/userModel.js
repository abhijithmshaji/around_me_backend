// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String }, // full name (first + last)
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile
    website: String,
    company: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    pincode: String,
    profileImage: String, // image filename or URL

    role: {
      type: String,
      enum: ["general", "manager", "admin"],
      default: "general",
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
