const Tool = require("../models/Tool");
const axios = require("axios");
const User = require("../models/User");
require("dotenv").config();

const OPENCAGE_KEY = process.env.OPENCAGE_API_KEY;

// 🔥 HELPER FUNCTION
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


// ➕ ADD TOOL (FIXED PROPERLY)
exports.addTool = async (req, res) => {
  try {
    // ✅ CHECK VERIFICATION
    const user = await User.findById(req.user.id);

    if (user.isVerified !== "verified") {
      return res.status(403).json({
        msg: "You are not verified by admin yet",
      });
    }

    const { name, price, latitude, longitude } = req.body;

    const loc = await getAddressFromCoords(latitude, longitude);

    const tool = await Tool.create({
      owner: req.user.id,
      name,
      price: Number(price),
      availability: true,

      address: loc.address,
      city: loc.city,
      pincode: loc.pincode,

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.json(tool);
  } catch (err) {
    console.log("Add Tool Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// 📥 GET MY TOOLS
exports.getMyTools = async (req, res) => {
  const tools = await Tool.find({ owner: req.user.id });

  // ✅ ensure price always exists
  const fixed = tools.map((t) => ({
    ...t._doc,
    price: t.price || 0,
  }));

  res.json(fixed);
};


// 📍 GET NEARBY TOOLS
exports.getNearbyTools = async (req, res) => {
  try {
    const { latitude, longitude, name } = req.query;

    let query = {
      availability: true,
    };

    // ✅ FILTER BY TOOL NAME (IMPORTANT FIX)
    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // case-insensitive
    }

    // ✅ ADD LOCATION FILTER
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 20000,
        },
      };
    }

    const tools = await Tool.find(query).populate("owner", "name phone");

    res.json(tools);
  } catch (err) {
    console.log("Nearby Tools Error:", err);
    res.status(500).json({ msg: err.message });
  }
};