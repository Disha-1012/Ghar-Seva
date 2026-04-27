const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addTool,
  getMyTools,
  getNearbyTools,
} = require("../controllers/toolController");

router.post("/add", auth, addTool);
router.get("/my", auth, getMyTools);
router.get("/nearby", auth, getNearbyTools);

// 🔥 ADD THIS (for fallback listing if needed)
router.get("/", auth, getNearbyTools);

module.exports = router;