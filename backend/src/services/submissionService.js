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
const testCaseService = require("./testCaseService");

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
        const containerName = `submission-${submission.id}`;
        output = await runCppCode(folderPath, containerName);
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

const fetchAllSubmissions = async (userid) => {
  const result = await submissionRepository.fetchAllSubmissions(userid);
  return result;
};

const runSourceCode = async (problemData) => {
  const tempId = Date.now();
  const containerName = `run-${tempId}`;
  const folderPath = await createSubmissionFile(tempId, problemData.code);

  try {
    await compileCppCode(folderPath);
  } catch (error) {
    console.log(error);
    return {
      status: "Compilation Error",
      error: error.stderr,
    };
  }
  try {
    if (!problemData.input.trim()) {
      const sampleTestCases = await testCaseService.getSampleTestCases(
        problemData.problemId,
      );

      const result = [];

      for (const [index, testCase] of sampleTestCases.entries()) {
        await createInputFile(folderPath, testCase.question_input);
        let output;
        try {
          console.log(testCase.question_input);
          output = await runCppCode(folderPath, containerName);
        } catch (error) {
          if (error.killed) {
            // Time Limit Exceeded
            return {
              status: "Time Limit Exceeded",
            };
          } else {
            // Runtime Error
            return {
              status: "Runtime Error",
            };
          }
        }
        const status = compareOutput(output, testCase.expected_output);

        result.push({
          sample: index + 1,
          actualOutput: output.trim(),
          expectedOutput: testCase.expected_output.trim(),
          passed: status,
        });
      }
      return {
        status: "Success",
        results: result,
      };
    } else {
      await createInputFile(folderPath, problemData.input);
      let output;
      try {
        output = await runCppCode(folderPath, containerName);
      } catch (error) {
        console.log(error);
        if (error.killed) {
          return {
            status: "Time Limit Exceeded",
          };
        } else {
          return {
            status: "Runtime Error",
          };
        }
      }
      const passed = compareOutput(output, problemData.expectedOutput);

      return {
        status: "Success",
        actualOutput: output.trim(),
        expectedOutput: problemData.expectedOutput.trim(),
        passed,
      };
    }
  } finally {
    await deleteSubmissionFolder(folderPath);
  }
};

const fetchProblemSubmissions = async (userId, problemId) => {
  const result = await submissionRepository.fetchProblemSubmissions(
    userId,
    problemId,
  );
  return result;
};
module.exports = {
  createSubmission,
  processSubmission,
  getSubmission,
  fetchAllSubmissions,
  runSourceCode,
  fetchProblemSubmissions,
};
