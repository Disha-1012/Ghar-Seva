const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },

  availability: {
    type: Boolean,
    default: true,
  },

  // ✅ NEW ADDRESS FIELDS
  address: String,
  city: String,
  pincode: String,

  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number],
  },

});

toolSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Tool", toolSchema);