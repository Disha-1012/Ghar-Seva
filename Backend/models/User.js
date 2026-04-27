const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    required: true, // ✅ ADD THIS
  },
  password: String,
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
  },

  // ✅ NEW FIELD
  profilePic: {
    type: String,
    default: "",
  },

  // ✅ NEW
  isVerified: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("User", userSchema);