const problemService = require("../services/problemService");

async function createProblem(req, res) {
  const problemData = { ...req.body, created_by: req.user.id };
  try {
    let returnedValue = await problemService.createProblem(problemData);
    res.status(201).json({
      message: returnedValue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating problem",
      error: error.message,
    });
  }
}

async function getAllProblems(req, res) {
  try {
    const { search, difficulty } = req.query;

    const problems = await problemService.getAllProblems(search, difficulty);

    res.status(200).json({
      message: "Problems retrieved successfully",
      result: problems,
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
    res.status(200).json(problem);
  } catch (error) {
    if (error.message === "Problem not found") {
      res.status(404).json({
        message: "Problem not found",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error retrieving problem",
        error: error.message,
      });
    }
  }
}
module.exports = { createProblem, getAllProblems, getProblem };
