const testCaseRepository = require("../repositories/testCaseRepository");

async function createTestCase(problemData) {
  return await testCaseRepository.createTestCase(problemData);
}
module.exports = {
  createTestCase,
};
