const problemService = require("../services/problemService");

async function createProblem(req, res) {
  const problemData = {...req.body , created_by: req.user.id };
  let returnedValue = await problemService.createProblem(problemData);
  res.status(200).json({
    message: returnedValue,
  });
}

module.exports = { createProblem };
  