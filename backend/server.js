const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const produceRoutes = require("./routes/produceRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Farm2You API is running 🌾" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌾 Farm2You server running on http://localhost:${PORT}`);
});
