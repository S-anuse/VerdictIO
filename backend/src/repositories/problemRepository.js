const pool = require("../config/db");

async function createProblem(problemData) {
  const {
    title,
    description,
    difficulty,
    problem_constraints,
    time_limit,
    memory_limit,
    created_by,
  } = problemData;
  const result = await pool.query(
    "INSERT INTO problems (title , description , difficulty , problem_constraints , time_limit , memory_limit , created_by) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * ;",
    [
      title,
      description,
      difficulty,
      problem_constraints,
      time_limit,
      memory_limit,
      created_by,
    ],
  );
  return result.rows[0];
}
async function getAllProblems() {
  const result = await pool.query(
    "SELECT id , title , difficulty FROM problems;",
  );
  return result.rows;
}
async function getProblem(problemId) {
  const result = await pool.query(
    "SELECT question_input, expected_output FROM test_cases WHERE problem_id = $1 AND is_hidden = false;",
    [problemId],
  );
  return result.rows;
}
module.exports = { createProblem, getAllProblems, getProblem };
