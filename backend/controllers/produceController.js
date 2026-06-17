const db = require("../config/db");

// GET /api/produce  — all available produce (public, for consumers to browse)
const getAllProduce = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT p.*, u.name AS farmer_name, u.phone AS farmer_phone
      FROM produce p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.is_available = TRUE AND p.quantity_available > 0
    `;
    const params = [];

    if (category) {
      query += " AND p.category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await db.query(query, params);
    res.status(200).json({ produce: rows });
  } catch (err) {
    console.error("GetAllProduce error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/produce/:id  — single produce detail
const getProduceById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name AS farmer_name, u.phone AS farmer_phone, u.address AS farmer_address
       FROM produce p
       JOIN users u ON p.farmer_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produce not found." });
    }

    res.status(200).json({ produce: rows[0] });
  } catch (err) {
    console.error("GetProduceById error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/produce/farmer/my-listings  — farmer sees their own listings
const getMyListings = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM produce WHERE farmer_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.status(200).json({ listings: rows });
  } catch (err) {
    console.error("GetMyListings error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/produce  — farmer adds new listing
const createProduce = async (req, res) => {
  const { name, description, category, price_per_unit, unit, quantity_available, image_url } = req.body;

  if (!name || !price_per_unit || !unit || !quantity_available) {
    return res.status(400).json({ message: "Name, price, unit and quantity are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO produce (farmer_id, name, description, category, price_per_unit, unit, quantity_available, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, description || null, category || null, price_per_unit, unit, quantity_available, image_url || null]
    );

    res.status(201).json({
      message: "Produce listed successfully.",
      produceId: result.insertId,
    });
  } catch (err) {
    console.error("CreateProduce error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/produce/:id  — farmer updates their listing
const updateProduce = async (req, res) => {
  const { name, description, category, price_per_unit, unit, quantity_available, image_url, is_available } = req.body;

  try {
    // Make sure this produce belongs to the logged-in farmer
    const [existing] = await db.query(
      "SELECT id FROM produce WHERE id = ? AND farmer_id = ?",
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Listing not found or not authorized." });
    }

    await db.query(
      `UPDATE produce SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        price_per_unit = COALESCE(?, price_per_unit),
        unit = COALESCE(?, unit),
        quantity_available = COALESCE(?, quantity_available),
        image_url = COALESCE(?, image_url),
        is_available = COALESCE(?, is_available)
       WHERE id = ?`,
      [name, description, category, price_per_unit, unit, quantity_available, image_url, is_available, req.params.id]
    );

    res.status(200).json({ message: "Listing updated successfully." });
  } catch (err) {
    console.error("UpdateProduce error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/produce/:id  — farmer deletes their listing
const deleteProduce = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT id FROM produce WHERE id = ? AND farmer_id = ?",
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Listing not found or not authorized." });
    }

    await db.query("DELETE FROM produce WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (err) {
    console.error("DeleteProduce error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getAllProduce,
  getProduceById,
  getMyListings,
  createProduce,
  updateProduce,
  deleteProduce,
};
