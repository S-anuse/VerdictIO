const problemRepository = require("../repositories/problemRepository");

async function createProblem(problemData) {
  const { testCases, ...probData } = problemData;
  const newProblem = await problemRepository.createProblem(probData);

  if (testCases && Array.isArray(testCases) && testCases.length > 0) {
    const testCaseRepository = require("../repositories/testCaseRepository");
    for (const tc of testCases) {
      if (tc.question_input && tc.expected_output) {
        await testCaseRepository.createTestCase({
          problem_id: newProblem.id,
          question_input: tc.question_input,
          expected_output: tc.expected_output,
          is_hidden: tc.is_hidden || false,
        });
      }
    }
  }

  return newProblem;
}

async function getAllProblems(search, difficulty) {
  return await problemRepository.getAllProblems(search, difficulty);
}

async function getProblem(problemId) {
  const problem = await problemRepository.getProblem(problemId);
  if (!problem) {
    throw new Error("Problem not found");
  }
  return problem;
}

async function updateProblem(problemId, problemData, user) {
  const existing = await problemRepository.getProblem(problemId);
  if (!existing || !existing.problem) {
    throw new Error("Problem not found");
  }
  const isOwner = existing.problem.created_by === user.id;
  const isAdmin = user.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("Unauthorized: You can only edit problems created by you");
    error.status = 403;
    throw error;
  }

  return await problemRepository.updateProblem(problemId, problemData);
}

async function deleteProblem(problemId, user) {
  const existing = await problemRepository.getProblem(problemId);
  if (!existing || !existing.problem) {
    throw new Error("Problem not found");
  }
  const isOwner = existing.problem.created_by === user.id;
  const isAdmin = user.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("Unauthorized: You can only delete problems created by you");
    error.status = 403;
    throw error;
  }

  return await problemRepository.deleteProblem(problemId);
}

module.exports = {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
};
