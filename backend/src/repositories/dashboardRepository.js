const pool = require("../config/db");

const getTotalSolved = async (userId) => {
  const result = await pool.query(
    `
    SELECT COUNT(DISTINCT problem_id) AS total_solved
    FROM submissions
    WHERE user_id = $1
      AND status = 'Accepted';
    `,
    [userId],
  );

  return result.rows[0];
};
const getTotalSubmissions = async (userId) => {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS total_submissions
    FROM submissions
    WHERE user_id = $1;
    `,
    [userId],
  );

  return result.rows[0];
};
const getRecentSubmissions = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        s.id,
        p.title,
        s.language,
        s.status,
        s.created_at
    FROM submissions s
    JOIN problems p
        ON s.problem_id = p.id
    WHERE s.user_id = $1
    ORDER BY s.created_at DESC
    LIMIT 5;
    `,
    [userId],
  );

  return result.rows;
};
module.exports = {
  getRecentSubmissions,
  getTotalSolved,
  getTotalSubmissions,
};
