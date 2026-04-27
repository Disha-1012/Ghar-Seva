const axios = require("axios");

const getAddressFromCoords = async (lat, lng) => {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    const res = await axios.get(url);

    const result = res.data.results[0];

    if (!result) return {};

    const comp = result.components;

    return {
      street:
        comp.road ||
        comp.neighbourhood ||
        comp.suburb ||
        "",
      city:
        comp.city ||
        comp.town ||
        comp.village ||
        "",
      state: comp.state || "",
      pincode: comp.postcode || "",
      country: comp.country || "",
      fullAddress: result.formatted || "",
    };
  } catch (err) {
    console.log("Geocode Error:", err.message);
    return {};
  }
};

module.exports = getAddressFromCoords;