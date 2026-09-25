const pool = require("../config/db");

async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users ORDER BY id ASC;"
  );
  return result.rows;
}

async function updateUserRole(userId, role) {
  const result = await pool.query(
    "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role;",
    [role, userId]
  );
  return result.rows[0];
}

async function deleteUser(userId) {
  // First clean up submissions by this user
  await pool.query("DELETE FROM submissions WHERE user_id = $1;", [userId]);
  // Nullify created_by in problems created by user
  await pool.query("UPDATE problems SET created_by = NULL WHERE created_by = $1;", [userId]);
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, name, email;",
    [userId]
  );
  return result.rows[0];
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
      time_limit,
      memory_limit,
      problemId,
    ]
  );
  return result.rows[0];
}

async function deleteProblem(problemId) {
  // Delete associated test cases first
  await pool.query("DELETE FROM test_cases WHERE problem_id = $1;", [problemId]);
  // Delete associated submissions
  await pool.query("DELETE FROM submissions WHERE problem_id = $1;", [problemId]);
  // Delete problem
  const result = await pool.query("DELETE FROM problems WHERE id = $1 RETURNING *;", [
    problemId,
  ]);
  return result.rows[0];
}

async function deleteTestCase(testCaseId) {
  const result = await pool.query(
    "DELETE FROM test_cases WHERE id = $1 RETURNING *;",
    [testCaseId]
  );
  return result.rows[0];
}

async function getAdminStats() {
  const usersCount = await pool.query("SELECT COUNT(*)::int as count FROM users;");
  const adminsCount = await pool.query("SELECT COUNT(*)::int as count FROM users WHERE role = 'admin';");
  const problemsCount = await pool.query("SELECT COUNT(*)::int as count FROM problems;");
  const submissionsCount = await pool.query("SELECT COUNT(*)::int as count FROM submissions;");

  return {
    totalUsers: usersCount.rows[0].count,
    totalAdmins: adminsCount.rows[0].count,
    totalProblems: problemsCount.rows[0].count,
    totalSubmissions: submissionsCount.rows[0].count,
  };
}

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProblem,
  deleteProblem,
  deleteTestCase,
  getAdminStats,
};
