import User from "../models/userModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: eventId }
    });

    res.json({ message: "Event added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: eventId }
    });

    res.json({ message: "Event removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ============================
// Update Profile
// ============================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const {
      firstName,
      lastName,
      website,
      company,
      phone,
      address,
      city,
      country,
      pincode,
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      website,
      company,
      phone,
      address,
      city,
      country,
      pincode,
    };

    // If image uploaded
    if (req.file) {
      updateData.profileImage = "/uploads/profile/" + req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

