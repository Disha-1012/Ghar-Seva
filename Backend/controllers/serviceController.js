const Service = require("../models/Service");
const axios = require("axios");
require("dotenv").config();
const User = require("../models/User");

const OPENCAGE_KEY = process.env.OPENCAGE_API_KEY;


const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}`
    );

    const data = res.data.results[0];

    return {
      address: data.formatted,
      city:
        data.components.city ||
        data.components.town ||
        data.components.village ||
        "",
      pincode: data.components.postcode || "",
    };
  } catch (err) {
    console.log("Geocode error:", err.message);
    return {};
  }
};
// ➕ Add Service (UPDATED WITH LOCATION)
exports.addService = async (req, res) => {
  try {
    // ✅ CHECK PROVIDER VERIFICATION
    const user = await User.findById(req.user.id);

    if (user.isVerified !== "verified") {
      return res.status(403).json({
        msg: "You are not verified by admin yet",
      });
    }

    const {
      serviceType,
      basePrice,
      latitude,
      longitude,
      startTime,
      endTime,
    } = req.body;

    const loc = await getAddressFromCoords(latitude, longitude);

    const service = await Service.create({
      providerId: req.user.id,
      serviceType,
      basePrice,
      availability: true,
      startTime,
      endTime,

      address: loc.address,
      city: loc.city,
      pincode: loc.pincode,

      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      },
    });

    res.json(service);
  } catch (err) {
    console.log("Add service error:", err);
    res.status(500).json({ msg: "Error adding service" });
  }
};

// 📥 Get All Services (UNCHANGED - fallback)
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({
      availability: true,
    }).populate("providerId", "_id name phone");

    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 NEW: GET NEARBY SERVICES (CORE FEATURE)
exports.getNearbyServices = async (req, res) => {
  try {
    const { latitude, longitude, serviceType } = req.query;

    // ❗ Validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        msg: "Latitude & Longitude required",
      });
    }

    // 🔥 GEO QUERY
    const services = await Service.find({
      availability: true,
      ...(serviceType && { serviceType }),

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 5000, // 🔥 5 km radius
        },
      },
    }).populate("providerId", "_id name phone");

    res.json(services);
  } catch (err) {
    console.log("Nearby Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// 👤 Provider's Own Services
exports.getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({
      providerId: req.user.id,
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔄 Toggle Availability
exports.toggleAvailability = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        msg: "Service not found",
      });
    }

    // ✅ Flip availability
    service.availability = !service.availability;

    await service.save();

    res.json({
      msg: "Availability updated",
      service,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};