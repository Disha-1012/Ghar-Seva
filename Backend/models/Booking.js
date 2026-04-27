const mongoose = require("mongoose"); // ✅ FIX ADDED

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },

  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tool",
  },

  basePrice: Number,
  offeredPrice: Number,
  finalPrice: Number,

  // ✅ NEW TIME FIELDS
  bookingDate: {
    type: String,
  },
  endDate: {
    type: String,
  },

  startTime: {
    type: String,
  },

  endTime: {
    type: String,
  },

  // ✅ NEW: ADDRESS SNAPSHOT
  customerAddress: String,
  customerCity: String,
  customerPincode: String,

  providerAddress: String,
  providerCity: String,
  providerPincode: String,

  status: {
    type: String,
    enum: [
      "negotiating",
      "customer_booked",
      "accepted",
      "rejected",
      "completed",
      "return_requested",
      "rent_completed",
    ],
    default: "negotiating",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);