const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addService,
  getServices,
  getProviderServices,
  toggleAvailability,
  getNearbyServices, // ✅ NEW
} = require("../controllers/serviceController");

router.post("/add", auth, addService);

// 🔥 NEW ROUTE
router.get("/nearby", auth, getNearbyServices);

router.get("/", getServices);
router.get("/my", auth, getProviderServices);
router.put("/toggle/:id", auth, toggleAvailability);

module.exports = router;