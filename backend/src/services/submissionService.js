const submissionRepository = require("../repositories/submissionRepository");
const {
  createInputFile,
  deleteSubmissionFolder,
  createSubmissionFile,
} = require("../utils/fileHandler");

const { compareOutput } = require("../utils/outputComparator");
const { submissionQueue } = require("../queue/submissionQueue");
const { executeCode } = require("../utils/codeExecutor");

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
    submission.language, // Pass language
  );

  console.log(submission);
  console.log(folderPath);

  try {
    await submissionRepository.updateSubmissionStatus(submission.id, "Running");

    const testCases = await testCaseRepository.fetchAllTestCases(
      submission.problem_id,
    );

    for (const testCase of testCases) {
      await createInputFile(folderPath, testCase.question_input);

      let output;
      try {
        console.log(testCase.question_input);
        output = await executeCode(
          folderPath,
          submission.language.toLowerCase(),
          submission.source_code,
          testCase.question_input,
        );
      } catch (error) {
        if (error.killed) {
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Time Limit Exceeded",
          );
          return;
        } else if (error.status === "Compilation Error") {
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Compilation Error",
          );
          return;
        } else {
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
  }
};

const runSourceCode = async (problemData) => {
  const tempId = Date.now();
  const folderPath = await createSubmissionFile(
    tempId,
    problemData.code, // sourceCode
    problemData.language, // language
  );

  try {
    const hasCustomInput = problemData.input !== undefined && problemData.input !== null && problemData.input.trim() !== "";

    if (hasCustomInput) {
      await createInputFile(folderPath, problemData.input);

      const output = await executeCode(
        folderPath,
        problemData.language.toLowerCase(),
        problemData.code,
        problemData.input,
      );

      return {
        status: "Success",
        actualOutput: output,
        expectedOutput: problemData.expectedOutput || "",
        passed: problemData.expectedOutput
          ? compareOutput(output, problemData.expectedOutput)
          : true,
      };
    } else {
      // Run against all sample test cases
      const sampleTestCases = await testCaseRepository.fetchSampleTestCases(
        problemData.problemId,
      );

      if (sampleTestCases && sampleTestCases.length > 0) {
        const results = [];
        for (let i = 0; i < sampleTestCases.length; i++) {
          const testCase = sampleTestCases[i];
          const output = await executeCode(
            folderPath,
            problemData.language.toLowerCase(),
            problemData.code,
            testCase.question_input || "",
          );

          results.push({
            sample: i + 1,
            actualOutput: output,
            expectedOutput: testCase.expected_output,
            passed: compareOutput(output, testCase.expected_output),
          });
        }

        return {
          status: "Success",
          results,
        };
      } else {
        // No sample test cases, run with empty input
        const output = await executeCode(
          folderPath,
          problemData.language.toLowerCase(),
          problemData.code,
          "",
        );

        return {
          status: "Success",
          actualOutput: output,
          expectedOutput: "",
          passed: true,
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      status: error.status || "Error",
      error: error.stderr || error.message,
    };
  } finally {
    await deleteSubmissionFolder(folderPath);
  }
};

const getSubmission = async (submissionId) => {
  return await submissionRepository.fetchSubmission(submissionId);
};

const fetchAllSubmissions = async (userid) => {
  return await submissionRepository.fetchAllSubmissions(userid);
};

const fetchProblemSubmissions = async (userId, problemId) => {
  return await submissionRepository.fetchProblemSubmissions(userId, problemId);
};

module.exports = {
  createSubmission,
  processSubmission,
  getSubmission,
  fetchAllSubmissions,
  runSourceCode,
  fetchProblemSubmissions,
};
