const User = require("../models/userModel");

// Get all events from all users
exports.getAllEvents = async (req, res) => {
  try {
    const users = await User.find();

    const allEvents = users.flatMap((user) =>
      user.products.map((product) => ({
        ...product.toObject(),
        createdBy: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      }))
    );

    res.status(200).json({ success: true, events: allEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update event status (approve/reject)
exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    // Find the user containing this event
    const user = await User.findOne({ "products._id": eventId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Update the event status
    const event = user.products.id(eventId);
    event.eventStatus = status;

    await user.save();

    res.status(200).json({ success: true, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a user by admin
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
