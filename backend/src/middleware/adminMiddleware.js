const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function isAdminLoggedIn(req, res, next) {
  try {
    let user = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.user.id,
    ]);
    console.log(req.user.id);
    console.log(user.rows);
    if (user.rows.length === 0 || user.rows[0].role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}
module.exports = { isAdminLoggedIn };
