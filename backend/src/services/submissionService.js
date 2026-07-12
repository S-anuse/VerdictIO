const submissionRepository = require("../repositories/submissionRepository");
const { createInputFile } = require("../utils/fileHandler");

const createSubmissionFile =
  require("../utils/fileHandler").createSubmissionFile;
const { executeCppCode } = require("../utils/dockerExecutor");

const testCaseRepository = require("../repositories/testCaseRepository");

const createSubmission = async (submissionData) => {
  try {
    const submission =
      await submissionRepository.createSubmission(submissionData);
    const folderPath = await createSubmissionFile(
      submission.id,
      submission.source_code,
    );
    const testCases = await testCaseRepository.fetchAllTestCases(
      submission.problem_id,
    );
    for (const testCase of testCases) {
      await createInputFile(folderPath, testCase.question_input);
      const output = await executeCppCode(folderPath);
      console.log(output);
    }

    return submission;
  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to create submission");
  }
};

module.exports = { createSubmission };
