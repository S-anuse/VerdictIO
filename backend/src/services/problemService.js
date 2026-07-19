const problemRepository = require("../repositories/problemRepository");

async function createProblem(problemData) {
  const newProblem = await problemRepository.createProblem(problemData);
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
module.exports = { createProblem, getAllProblems, getProblem };
