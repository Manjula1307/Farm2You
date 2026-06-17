const express = require("express");
const router = express.Router();
const {
  getAllProduce,
  getProduceById,
  getMyListings,
  createProduce,
  updateProduce,
  deleteProduce,
} = require("../controllers/produceController");
const { verifyToken, isFarmer } = require("../middleware/auth");

// Public routes (no auth needed)
router.get("/", getAllProduce);                        // GET /api/produce
router.get("/:id", getProduceById);                   // GET /api/produce/:id

// Farmer-only routes
router.get("/farmer/my-listings", verifyToken, isFarmer, getMyListings);   // GET /api/produce/farmer/my-listings
router.post("/", verifyToken, isFarmer, createProduce);                     // POST /api/produce
router.put("/:id", verifyToken, isFarmer, updateProduce);                   // PUT /api/produce/:id
router.delete("/:id", verifyToken, isFarmer, deleteProduce);                // DELETE /api/produce/:id

module.exports = router;
