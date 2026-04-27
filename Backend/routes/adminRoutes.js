const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getAllProviders,
  verifyProvider,
  rejectProvider,
} = require("../controllers/adminController");

// ✅ GET PROVIDERS
router.get("/providers", auth, getAllProviders);

// ✅ VERIFY / REJECT
router.put("/verify/:id", auth, verifyProvider);
router.put("/reject/:id", auth, rejectProvider);

module.exports = router;