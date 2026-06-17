const db = require("../config/db");

// POST /api/orders  — consumer places an order
const placeOrder = async (req, res) => {
  const { items, delivery_address } = req.body;
  // items = [{ produce_id, quantity }, ...]

  if (!items || items.length === 0 || !delivery_address) {
    return res.status(400).json({ message: "Items and delivery address are required." });
  }

  const connection = await (await import("../config/db.js")).default.getConnection();

  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    const orderItems = [];

    // Validate each item and calculate total
    for (const item of items) {
      const [rows] = await connection.query(
        "SELECT * FROM produce WHERE id = ? AND is_available = TRUE AND quantity_available >= ?",
        [item.produce_id, item.quantity]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          message: `Produce ID ${item.produce_id} is unavailable or insufficient stock.`,
        });
      }

      const produce = rows[0];
      const subtotal = produce.price_per_unit * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        produce_id: produce.id,
        farmer_id: produce.farmer_id,
        quantity: item.quantity,
        price_per_unit: produce.price_per_unit,
        subtotal,
      });
    }

    // Create the order
    const [orderResult] = await connection.query(
      "INSERT INTO orders (consumer_id, total_amount, delivery_address) VALUES (?, ?, ?)",
      [req.user.id, totalAmount, delivery_address]
    );

    const orderId = orderResult.insertId;

    // Insert order items and reduce stock
    for (const item of orderItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, produce_id, farmer_id, quantity, price_per_unit, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.produce_id, item.farmer_id, item.quantity, item.price_per_unit, item.subtotal]
      );

      // Reduce stock
      await connection.query(
        "UPDATE produce SET quantity_available = quantity_available - ? WHERE id = ?",
        [item.quantity, item.produce_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order placed successfully.",
      orderId,
      totalAmount,
    });
  } catch (err) {
    await connection.rollback();
    console.error("PlaceOrder error:", err);
    res.status(500).json({ message: "Server error while placing order." });
  } finally {
    connection.release();
  }
};

// GET /api/orders/my-orders  — consumer views their order history
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE consumer_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    // Get items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS produce_name, p.unit, u.name AS farmer_name
         FROM order_items oi
         JOIN produce p ON oi.produce_id = p.id
         JOIN users u ON oi.farmer_id = u.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error("GetMyOrders error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/orders/:id  — consumer views a single order detail
const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND consumer_id = ?",
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.*, p.name AS produce_name, p.unit, u.name AS farmer_name, u.phone AS farmer_phone
       FROM order_items oi
       JOIN produce p ON oi.produce_id = p.id
       JOIN users u ON oi.farmer_id = u.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;
    res.status(200).json({ order });
  } catch (err) {
    console.error("GetOrderById error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/orders/farmer/incoming  — farmer sees orders containing their produce
const getFarmerOrders = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT oi.*, o.status, o.delivery_address, o.created_at AS order_date,
              p.name AS produce_name, p.unit,
              u.name AS consumer_name, u.phone AS consumer_phone
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN produce p ON oi.produce_id = p.id
       JOIN users u ON o.consumer_id = u.id
       WHERE oi.farmer_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ orders: items });
  } catch (err) {
    console.error("GetFarmerOrders error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/orders/:id/status  — farmer updates order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["confirmed", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    // Verify the order has items from this farmer
    const [check] = await db.query(
      "SELECT order_id FROM order_items WHERE order_id = ? AND farmer_id = ?",
      [req.params.id, req.user.id]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: "Not authorized to update this order." });
    }

    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    res.status(200).json({ message: `Order status updated to ${status}.` });
  } catch (err) {
    console.error("UpdateOrderStatus error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getFarmerOrders,
  updateOrderStatus,
};
