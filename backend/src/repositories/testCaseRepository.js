const pool = require("../config/db");
async function createTestCase(testCaseData) {
  const { problem_id, question_input, expected_output, is_hidden } =
    testCaseData;
  const result = await pool.query(
    "INSERT INTO  test_cases (problem_id , question_input , expected_output , is_hidden) VALUES ($1 , $2 , $3 , $4) RETURNING *",
    [problem_id, question_input, expected_output, is_hidden],
  );
  return result.rows[0];
}

const fetchAllTestCases = async (problemId) => {
  const result = await pool.query(
    "SELECT * FROM test_cases WHERE problem_id = $1;",
    [problemId],
  );
  return result.rows;
};
module.exports = {
  createTestCase,
  fetchAllTestCases,
};
