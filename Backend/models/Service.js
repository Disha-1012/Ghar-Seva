const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  serviceType: String,
  basePrice: Number,

  availability: {
    type: Boolean,
    default: true,
  },

  startTime: String,
  endTime: String,

  address: String,
  city: String,
  pincode: String,


  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  // ✅ NEW ADDRESS FIELDS
  address: String,
  city: String,
  pincode: String,
});

serviceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Service", serviceSchema);