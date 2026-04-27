const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const multer = require("multer");

// ==========================
// 📸 MULTER CONFIG
// ==========================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ==========================
// 🔐 AUTH ROUTES
// ==========================
router.post("/register", register);
router.post("/login", login);

// ==========================
// ✅ GET PROFILE
// ==========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// ✅ UPLOAD PROFILE PIC
// ==========================
router.put(
  "/profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.profilePic = `http://${req.headers.host}/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Profile updated",
        profilePic: user.profilePic,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;