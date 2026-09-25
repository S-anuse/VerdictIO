const testCaseService = require("../services/testCaseService");
const problemRepository = require("../repositories/problemRepository");

async function createTestCase(req, res) {
  const problem_id = req.params.problemId;
  const { question_input, expected_output, is_hidden } = req.body;

  try {
    const probRes = await problemRepository.getProblem(problem_id);
    if (!probRes || !probRes.problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const isOwner = probRes.problem.created_by === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only add test cases to your own problems" });
    }

    const testCaseData = {
      problem_id,
      question_input,
      expected_output,
      is_hidden: is_hidden || false,
    };

    const newTestCase = await testCaseService.createTestCase(testCaseData);
    res.status(201).json(newTestCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create test case", details: error.message });
  }
}

const getTestCase = async (req, res) => {
  const problem_id = req.params.problemId;
  try {
    const testCases = await testCaseService.getTestCase(problem_id);
    res.status(200).json(testCases);
  } catch (error) {
    res.status(404).json({ message: "No test case found" });
  }
};

module.exports = {
  createTestCase,
  getTestCase,
};
