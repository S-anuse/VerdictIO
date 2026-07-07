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
  const result =  await pool.query(
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

module.exports = { createProblem };
