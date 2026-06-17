const jwt = require("jsonwebtoken");

// Verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Allow only farmers
const isFarmer = (req, res, next) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ message: "Access denied. Farmers only." });
  }
  next();
};

// Allow only consumers
const isConsumer = (req, res, next) => {
  if (req.user.role !== "consumer") {
    return res.status(403).json({ message: "Access denied. Consumers only." });
  }
  next();
};

module.exports = { verifyToken, isFarmer, isConsumer };
