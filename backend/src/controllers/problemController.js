const problemService = require("../services/problemService");

async function createProblem(req, res) {
  const problemData = { ...req.body, created_by: req.user.id };
  let returnedValue = await problemService.createProblem(problemData);
  res.status(200).json({
    message: returnedValue,
  });
}

async function getAllProblems(req, res) {
  try {
    const problems = await problemService.getAllProblems();
    res.status(200).json({
      message: problems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving problems",
      error: error.message,
    });
  }
}
async function getProblem(req, res) {
  try {
    const problem = await problemService.getProblem(req.params.id);
    res.status(200).json({
      message: problem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving problem",
      error: error.message,
    });
  }
}
module.exports = { createProblem, getAllProblems, getProblem };
