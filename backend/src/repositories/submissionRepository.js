const pool = require("../config/db");

const createSubmission = async (submissionData) => {
  const { userId, problemId, source_code, language, status } = submissionData;
  // Implementation for creating a submission in the database
  const result = await pool.query(
    "INSERT INTO submissions (user_id , problem_id , source_code , language , status) VALUES ($1 , $2 , $3 , $4 , $5) RETURNING *;",
    [userId, problemId, source_code, language, status],
  );

  return result.rows[0];
};

const updateSubmissionStatus = async (submissionId, status) => {
  const result = await pool.query(
    "UPDATE submissions SET status = $1 where id = $2 RETURNING *;",
    [status, submissionId],
  );
  return result.rows[0];
};

module.exports = { createSubmission, updateSubmissionStatus };
