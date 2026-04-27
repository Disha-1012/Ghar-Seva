const User = require("../models/User");

// 📥 GET ALL PROVIDERS
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ VERIFY PROVIDER
exports.verifyProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isVerified = "verified";
    await user.save();

    res.json({ msg: "Provider verified" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ❌ REJECT PROVIDER
exports.rejectProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isVerified = "rejected";
    await user.save();

    res.json({ msg: "Provider rejected" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};