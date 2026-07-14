const submissionRepository = require("../repositories/submissionRepository");
const {
  createInputFile,
  deleteSubmissionFolder,
} = require("../utils/fileHandler");
const { compareOutput } = require("../utils/outputComparator");
const { submissionQueue } = require("../queue/submissionQueue");

const createSubmissionFile =
  require("../utils/fileHandler").createSubmissionFile;
const { compileCppCode, runCppCode } = require("../utils/dockerExecutor");

const testCaseRepository = require("../repositories/testCaseRepository");

const createSubmission = async (submissionData) => {
  const submission =
    await submissionRepository.createSubmission(submissionData);
  await submissionQueue.add("executeSubmission", {
    submissionId: submission.id,
  });
  return submission;
};

const processSubmission = async (submissionId) => {
  const submission = await submissionRepository.fetchSubmission(submissionId);
  const folderPath = await createSubmissionFile(
    submission.id,
    submission.source_code,
  );

  console.log(submission);
  console.log(folderPath);
  try {
    await submissionRepository.updateSubmissionStatus(submission.id, "Running");
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
        console.log(testCase.question_input);
        output = await runCppCode(folderPath);
      } catch (error) {
        if (error.killed) {
          // Time Limit Exceeded
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Time Limit Exceeded",
          );
          return;
        } else {
          // Runtime Error
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Runtime Error",
          );
          return;
        }
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
    await submissionRepository.updateSubmissionStatus(
      submission.id,
      "Accepted",
    );
  } catch (error) {
    console.error(error);
  } finally {
    await deleteSubmissionFolder(folderPath);
    return;
  }
};

const getSubmission = async (submissionId) => {
  const result = await submissionRepository.fetchSubmission(submissionId);
  return result;
};

module.exports = { createSubmission, processSubmission, getSubmission };
