const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Security rule: Always assign default 'user' role on registration.
  // Never trust role supplied by a user during registration.
  const assignedRole = "user";

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1 ;", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ;",
      [name, email, hash, assignedRole],
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1 ;", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const pass = await bcrypt.compare(password, user.rows[0].password);
    if (!pass) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const userObj = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userObj,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id],
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login, getMe };
