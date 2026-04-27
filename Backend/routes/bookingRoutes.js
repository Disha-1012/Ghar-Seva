const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createBooking,
  createToolBooking,
  getProviderBookings,
  getCustomerBookings,
  acceptBooking,
  rejectBooking,
  counterOffer,
  acceptOffer,
  rejectOffer,
  confirmCustomerBooking,
  getAllBookings,
  endService,
  requestReturnTool,
  endToolRenting,
} = require("../controllers/bookingController");

// ✅ CREATE BOOKINGS
router.post("/", auth, createBooking);
router.post("/tool", auth, createToolBooking);

// ✅ GET BOOKINGS
router.get("/provider", auth, getProviderBookings);
router.get("/customer", auth, getCustomerBookings);
// ✅ ADMIN ROUTE
router.get("/admin", auth, getAllBookings);

// ✅ PROVIDER ACTIONS
router.put("/:id/accept", auth, acceptBooking);
router.put("/:id/reject", auth, rejectBooking);

// ✅ NEGOTIATION
router.put("/:id/counter", auth, counterOffer);

// ✅ CUSTOMER ACTIONS
router.put("/:id/accept-offer", auth, acceptOffer);
router.put("/:id/reject-offer", auth, rejectOffer);
router.put(
  "/:id/confirm",
  auth,
  confirmCustomerBooking
);
// ✅ SERVICE END
router.put("/:id/end", auth, endService);
// ✅ TOOL RETURN FLOW
// ✅ TOOL RETURN FLOW
router.put("/:id/return", auth, requestReturnTool);
router.put("/:id/end-rent", auth, endToolRenting);

module.exports = router;