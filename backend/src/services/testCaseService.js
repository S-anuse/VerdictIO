const testCaseRepository = require("../repositories/testCaseRepository");

async function createTestCase(problemData) {
  return await testCaseRepository.createTestCase(problemData);
}
const getTestCase = async (problemId) => {
  return await testCaseRepository.fetchAllTestCases(problemId);
};

const getSampleTestCases = async (problemId) => {
  return await testCaseRepository.fetchSampleTestCases(problemId);
};
module.exports = {
  createTestCase,
  getTestCase,
  getSampleTestCases,
};
