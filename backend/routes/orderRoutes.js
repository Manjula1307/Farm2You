const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getFarmerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { verifyToken, isFarmer, isConsumer } = require("../middleware/auth");

// Consumer routes
router.post("/", verifyToken, isConsumer, placeOrder);                        // POST /api/orders
router.get("/my-orders", verifyToken, isConsumer, getMyOrders);               // GET /api/orders/my-orders
router.get("/:id", verifyToken, isConsumer, getOrderById);                    // GET /api/orders/:id

// Farmer routes
router.get("/farmer/incoming", verifyToken, isFarmer, getFarmerOrders);       // GET /api/orders/farmer/incoming
router.put("/:id/status", verifyToken, isFarmer, updateOrderStatus);          // PUT /api/orders/:id/status

module.exports = router;
