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
