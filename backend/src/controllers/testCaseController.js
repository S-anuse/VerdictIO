const testCaseService = require("../services/testCaseService");
async function createTestCase(req, res) {
  const problem_id = req.params.problemId;
  const { question_input, expected_output, is_hidden } = req.body;
  const testCaseData = {
    problem_id,
    question_input,
    expected_output,
    is_hidden,
  };
  try {
    const newTestCase = await testCaseService.createTestCase(testCaseData);
    res.status(201).json(newTestCase);
  } catch (error) {
    res.status(500).json({ error: "Failed to create test case" });
  }
}

module.exports = {
  createTestCase,
};
