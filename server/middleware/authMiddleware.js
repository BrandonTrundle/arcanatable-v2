const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Verified user token:", decoded); // <-- Add this line
    req.user = decoded; // Attach user ID to request
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message); // <-- Add for clarity
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
