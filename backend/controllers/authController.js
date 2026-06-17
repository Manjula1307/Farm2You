const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required." });
  }

  if (!["farmer", "consumer"].includes(role)) {
    return res.status(400).json({ message: "Role must be either farmer or consumer." });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, phone || null, address || null]
    );

    const newUser = { id: result.insertId, email, role };
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: result.insertId, name, email, role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};

// GET /api/auth/me  (get logged in user profile)
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login, getMe };
