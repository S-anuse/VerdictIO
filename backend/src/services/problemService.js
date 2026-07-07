const problemRepository = require("../repositories/problemRepository");
const testCaseService = require("./testCaseService");

async function createProblem(problemData) {
  const testCases = problemData.testCases;
  const newProblemData = { ...problemData, testCases: undefined };
  const newProblem = await problemRepository.createProblem(newProblemData);
  for (const testCase of testCases) {
    await testCaseService.createTestCase({
      ...testCase,
      problem_id: newProblem.id,
    });
  }
  return newProblem;
}

module.exports = { createProblem };
