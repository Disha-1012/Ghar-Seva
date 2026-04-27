const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Tool = require("../models/Tool");
const axios = require("axios");
require("dotenv").config();

const OPENCAGE_KEY = process.env.OPENCAGE_API_KEY;

// ✅ HELPER FUNCTION
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

// ✅ CREATE BOOKING (SERVICE + TOOL)
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      toolId,
      offeredPrice,
      directBook,
      bookingDate,
      startTime,
      endTime,
    } = req.body;

    let bookingData = {
      customer: req.user.id,
      offeredPrice: offeredPrice || 0,
      bookingDate,
      startTime,
      endTime,
    };

    // 🔧 SERVICE
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service)
        return res.status(404).json({ msg: "Service not found" });

      bookingData.provider = service.providerId;
      bookingData.service = serviceId;
      bookingData.basePrice = service.basePrice || 0;

      // ✅ PROVIDER ADDRESS SNAPSHOT
      bookingData.providerAddress = service.address;
      bookingData.providerCity = service.city;
      bookingData.providerPincode = service.pincode;

      bookingData.status = directBook
        ? "customer_booked"
        : "negotiating";

      if (directBook) bookingData.finalPrice = service.basePrice;
    }

    // 🛠 TOOL
    if (toolId) {
      const tool = await Tool.findById(toolId);
      if (!tool)
        return res.status(404).json({ msg: "Tool not found" });

      bookingData.provider = tool.owner;
      bookingData.tool = toolId;
      bookingData.basePrice = tool.price || 0;

      // ✅ PROVIDER ADDRESS SNAPSHOT
      bookingData.providerAddress = tool.address;
      bookingData.providerCity = tool.city;
      bookingData.providerPincode = tool.pincode;

      bookingData.status = directBook
        ? "customer_booked"
        : "negotiating";

      if (directBook) bookingData.finalPrice = tool.price;
    }

    // ✅ CUSTOMER LOCATION FROM FRONTEND (lat/lng)
    if (req.body.latitude && req.body.longitude) {
      const customerLoc = await getAddressFromCoords(
        req.body.latitude,
        req.body.longitude
      );

      bookingData.customerAddress = customerLoc.address;
      bookingData.customerCity = customerLoc.city;
      bookingData.customerPincode = customerLoc.pincode;
    }

    const booking = await Booking.create(bookingData);

    const populated = await Booking.findById(booking._id)
      .populate("service")
      .populate("tool")
      .populate("customer");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ TOOL BOOKING (SEPARATE ROUTE - KEEP THIS)
exports.createToolBooking = async (req, res) => {
  try {
    const {
      toolId,
      offeredPrice,
      directBook,
      bookingDate,
      startTime,
      endTime,
      endDate,
    } = req.body;

    const tool = await Tool.findById(toolId);

    if (!tool)
      return res.status(404).json({ msg: "Tool not found" });

    let bookingData = {
      customer: req.user.id,
      provider: tool.owner,
      tool: toolId,
      basePrice: tool.price || 0,
      offeredPrice: offeredPrice || tool.price || 0,
      bookingDate,
      startTime,
      endTime,
      endDate,

      // ✅ PROVIDER ADDRESS
      providerAddress: tool.address,
      providerCity: tool.city,
      providerPincode: tool.pincode,

      status: directBook ? "customer_booked" : "negotiating",
      finalPrice: directBook ? tool.price : undefined,
    };

    // ✅ CUSTOMER ADDRESS
    if (req.body.latitude && req.body.longitude) {
      const customerLoc = await getAddressFromCoords(
        req.body.latitude,
        req.body.longitude
      );

      bookingData.customerAddress = customerLoc.address;
      bookingData.customerCity = customerLoc.city;
      bookingData.customerPincode = customerLoc.pincode;
    }

    const booking = await Booking.create(bookingData);

    const populated = await Booking.findById(booking._id)
      .populate("tool")
      .populate("customer");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ PROVIDER BOOKINGS
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user.id,
    })
      .populate("service")
      .populate("tool")
      .populate("customer");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ CUSTOMER BOOKINGS
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.id,
    })
      .populate("service")
      .populate("tool");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ ACCEPT (PROVIDER)
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "accepted";

    // ✅ KEY FIX (LOGICAL RULE)
    // If customer booked directly → basePrice
    // If negotiation → offeredPrice

    if (booking.offeredPrice && booking.offeredPrice > 0) {
      booking.finalPrice = booking.offeredPrice;
    } else {
      booking.finalPrice = booking.basePrice;
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("service")
      .populate("tool")
      .populate("customer");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ REJECT (PROVIDER)
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "rejected";

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ COUNTER OFFER (FIXED SAFE)
exports.counterOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // ❌ LOCK NEGOTIATION
    if (booking.status === "customer_booked") {
      return res.status(400).json({
        message: "Customer already booked. Negotiation locked.",
      });
    }

    booking.offeredPrice = req.body.offeredPrice;
    booking.status = "negotiating";

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("service")
      .populate("tool")
      .populate("customer");

    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ✅ CUSTOMER ACCEPT
exports.acceptOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "accepted";
    booking.finalPrice = booking.offeredPrice || booking.basePrice;

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ CUSTOMER REJECT
exports.rejectOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "rejected";
    booking.finalPrice = booking.basePrice || 0;

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmCustomerBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ msg: "Booking not found" });

    if (booking.status !== "negotiating") {
      return res.status(400).json({
        msg: "Cannot confirm now",
      });
    }

    booking.status = "customer_booked";

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("service")
      .populate("tool")
      .populate("customer");

    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ✅ ADMIN - GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name")
      .populate("provider", "name")
      .populate("service")
      .populate("tool");

    res.json(bookings);
  } catch (err) {
    console.log("Admin fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ SERVICE END (PROVIDER)
// ✅ SERVICE END (PROVIDER - FIXED)
exports.endService = async (req, res) => {
  try {
    console.log("END SERVICE HIT:", req.params.id);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔐 SECURITY CHECK (VERY IMPORTANT)
    if (booking.provider.toString() !== req.user.id) {
      console.log("❌ Unauthorized provider");
      return res.status(403).json({
        message: "Not authorized to end this service",
      });
    }

    // ❌ Only accepted services can be ended
    if (booking.status !== "accepted") {
      console.log("❌ Invalid status:", booking.status);
      return res.status(400).json({
        message: "Service can only be ended after acceptance",
      });
    }

    // ❌ Only SERVICE bookings allowed (not tools)
    if (!booking.service) {
      console.log("❌ Not a service booking");
      return res.status(400).json({
        message: "Only services can be ended",
      });
    }

    // ✅ UPDATE STATUS
    booking.status = "completed";

    await booking.save();

    // ✅ RETURN POPULATED DATA
    const updated = await Booking.findById(booking._id)
      .populate("service")
      .populate("tool")
      .populate("customer");

    console.log("✅ Service ended successfully");

    res.json(updated);
  } catch (err) {
    console.log("🔥 END SERVICE ERROR:", err); // VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
};

// ✅ CUSTOMER REQUEST RETURN TOOL
exports.requestReturnTool = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "accepted") {
      return res.status(400).json({
        message: "Tool must be accepted before return",
      });
    }

    booking.status = "return_requested";

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("tool")
      .populate("customer");

    res.json(updated);
  } catch (err) {
    console.log("RETURN REQUEST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ PROVIDER CONFIRMS RETURN
// ✅ PROVIDER CONFIRMS RETURN (FIXED)
exports.endToolRenting = async (req, res) => {
  try {
    console.log("END RENT HIT:", req.params.id);

    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // 🔐 SECURITY CHECK
    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ❌ ONLY TOOL BOOKINGS
    if (!booking.tool) {
      return res.status(400).json({
        message: "Not a tool booking",
      });
    }

    // ❌ MUST BE RETURN REQUESTED
    if (booking.status !== "return_requested") {
      return res.status(400).json({
        message: "No return request found",
      });
    }

    // ✅ FINAL STATUS
    booking.status = "rent_completed";

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("tool")
      .populate("customer");

    console.log("✅ Tool renting completed");

    res.json(updated);
  } catch (err) {
    console.log("🔥 END RENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};