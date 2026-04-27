const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: ALWAYS SET id
    req.user = {
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;