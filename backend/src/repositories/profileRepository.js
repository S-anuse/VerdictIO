const pool = require("../config/db");

const getprofile = async (userId) => {
  const result = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id = $1;`,
    [userId],
  );

  return result.rows[0];
};
const updateProfile = async (name, email, userId) => {
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role;",
    [name, email, userId],
  );
  return result.rows[0];
};
const updatePass = async (userId, password) => {
  const result = await pool.query(
    "UPDATE users SET password = $1 WHERE id = $2 ;",
    [password, userId],
  );
  return result.rows[0];
};
const getUserPass = async (userId) => {
  const result = await pool.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows[0];
};
module.exports = { getprofile, updateProfile, updatePass, getUserPass };
