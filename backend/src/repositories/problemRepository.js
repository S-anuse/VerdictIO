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
    "INSERT INTO problems (title, description, difficulty, problem_constraints, time_limit, memory_limit, created_by) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * ;",
    [
      title,
      description,
      difficulty,
      problem_constraints,
      time_limit || 2,
      memory_limit || 256,
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
      difficulty,
      created_by
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
    const probRes = await pool.query(
      "SELECT id, title, description, difficulty, problem_constraints, time_limit, memory_limit, created_by FROM problems WHERE id = $1;",
      [problemId]
    );

    if (probRes.rows.length === 0) {
      throw new Error("Problem not found");
    }

    const testCasesRes = await pool.query(
      "SELECT id, question_input, expected_output FROM test_cases WHERE problem_id = $1 AND is_hidden = false;",
      [problemId]
    );

    return {
      problem: probRes.rows[0],
      sampleTestCases: testCasesRes.rows,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateProblem(problemId, problemData) {
  const {
    title,
    description,
    difficulty,
    problem_constraints,
    time_limit,
    memory_limit,
  } = problemData;

  const result = await pool.query(
    `UPDATE problems 
     SET title = $1, description = $2, difficulty = $3, problem_constraints = $4, time_limit = $5, memory_limit = $6
     WHERE id = $7 RETURNING *;`,
    [
      title,
      description,
      difficulty,
      problem_constraints,
      time_limit || 2,
      memory_limit || 256,
      problemId,
    ]
  );
  return result.rows[0];
}

async function deleteProblem(problemId) {
  await pool.query("DELETE FROM test_cases WHERE problem_id = $1;", [problemId]);
  await pool.query("DELETE FROM submissions WHERE problem_id = $1;", [problemId]);
  const result = await pool.query("DELETE FROM problems WHERE id = $1 RETURNING *;", [
    problemId,
  ]);
  return result.rows[0];
}

module.exports = {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
};
