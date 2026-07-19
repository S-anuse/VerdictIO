const pool = require("../config/db");

async function createProblem(problemData) {
  const {
    id,
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
async function getAllProblems(search, difficulty) {
  let query = `
    SELECT
      id,
      title,
      difficulty
    FROM problems
    WHERE 1 = 1
  `;

  const values = [];

  if (search) {
    query += ` AND title ILIKE $${values.length + 1}`;
    values.push(`%${search}%`);
  }

  if (difficulty) {
    query += ` AND difficulty = $${values.length + 1}`;
    values.push(difficulty);
  }

  query += ` ORDER BY id`;

  const result = await pool.query(query, values);

  return result.rows;
}

async function getProblem(problemId) {
  try {
    const result = await pool.query(
      "SELECT title , description , difficulty , problem_constraints , time_limit , memory_limit , question_input, expected_output FROM test_cases JOIN problems ON test_cases.problem_id = problems.id WHERE problems.id = $1 AND test_cases.is_hidden = false;",
      [problemId],
    );
    if (result.rows.length === 0) {
      throw new Error("Problem not found");
    }
    const response = {
      problem: {
        title: result.rows[0].title,
        description: result.rows[0].description,
        difficulty: result.rows[0].difficulty,
        problem_constraints: result.rows[0].problem_constraints,
        time_limit: result.rows[0].time_limit,
        memory_limit: result.rows[0].memory_limit,
      },
      sampleTestCases: [],
    };

    for (const row of result.rows) {
      response.sampleTestCases.push({
        question_input: row.question_input,
        expected_output: row.expected_output,
      });
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
module.exports = { createProblem, getAllProblems, getProblem };
