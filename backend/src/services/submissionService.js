const submissionRepository = require("../repositories/submissionRepository");
const { createInputFile } = require("../utils/fileHandler");
const { compareOutput } = require("../utils/outputComparator");

const createSubmissionFile =
  require("../utils/fileHandler").createSubmissionFile;
const { compileCppCode, runCppCode } = require("../utils/dockerExecutor");

const testCaseRepository = require("../repositories/testCaseRepository");

const createSubmission = async (submissionData) => {
  const submission =
    await submissionRepository.createSubmission(submissionData);
  const folderPath = await createSubmissionFile(
    submission.id,
    submission.source_code,
  );

  try {
    await compileCppCode(folderPath);
  } catch (error) {
    await submissionRepository.updateSubmissionStatus(
      submission.id,
      "Compilation Error",
    );
    return;
  }
  const testCases = await testCaseRepository.fetchAllTestCases(
    submission.problem_id,
  );
  for (const testCase of testCases) {
    await createInputFile(folderPath, testCase.question_input);
    let output;
    try {
      output = await runCppCode(folderPath);
    } catch (error) {
      await submissionRepository.updateSubmissionStatus(
        submission.id,
        "Runtime Error",
      );
      return;
    }
    const result = compareOutput(output, testCase.expected_output);
    if (!result) {
      await submissionRepository.updateSubmissionStatus(
        submission.id,
        "Wrong Answer",
      );
      return;
    }
    console.log(output);
  }
  await submissionRepository.updateSubmissionStatus(submission.id, "Accepted");

  return submission;
};

module.exports = { createSubmission };
