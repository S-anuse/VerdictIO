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
  // Save the submission first, then add it to the execution queue.
  const submission =
    await submissionRepository.createSubmission(submissionData);

  await submissionQueue.add("executeSubmission", {
    submissionId: submission.id,
  });

  return submission;
};

const processSubmission = async (submissionId) => {
  let folderPath = null;
  let submission = null;

  try {
    console.log(`Processing submission ${submissionId}`);

    // Get the submission details from the database.
    submission =
      await submissionRepository.fetchSubmission(submissionId);

    console.log("Submission fetched:", submission);

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Mark the submission as running before starting execution.
    await submissionRepository.updateSubmissionStatus(
      submission.id,
      "Running"
    );

    console.log(`Submission ${submission.id} is now Running`);

    // Create a temporary folder for the submitted source code.
    folderPath = await createSubmissionFile(
      submission.id,
      submission.source_code,
      submission.language
    );

    console.log("Temporary folder created:", folderPath);

    // Get all test cases for the selected problem.
    const testCases =
      await testCaseRepository.fetchAllTestCases(
        submission.problem_id
      );

    console.log(`Found ${testCases.length} test cases`);

    // Run the submitted code against each test case.
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      console.log(
        `Running test case ${i + 1}/${testCases.length}`
      );

      let output;

      try {
        output = await executeCode(
          folderPath,
          submission.language.toLowerCase(),
          submission.source_code,
          testCase.question_input
        );

        console.log("Program output:", output);

      } catch (error) {
        console.error("Execution error:", error);

        if (error.killed) {
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Time Limit Exceeded"
          );
          return;
        }

        if (error.status === "Compilation Error") {
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Compilation Error"
          );
          return;
        }

        if (error.status === "Memory Limit Exceeded") {
          await submissionRepository.updateSubmissionStatus(
            submission.id,
            "Memory Limit Exceeded"
          );
          return;
        }

        await submissionRepository.updateSubmissionStatus(
          submission.id,
          "Runtime Error"
        );

        return;
      }

      // Compare the program output with the expected output.
      const result = compareOutput(
        output,
        testCase.expected_output
      );

      console.log(
        "Expected output:",
        testCase.expected_output
      );

      if (!result) {
        console.log("Wrong Answer");

        await submissionRepository.updateSubmissionStatus(
          submission.id,
          "Wrong Answer"
        );

        return;
      }

      console.log(`Test case ${i + 1} passed`);
    }

    // If every test case passes, mark the submission as accepted.
    await submissionRepository.updateSubmissionStatus(
      submission.id,
      "Accepted"
    );

    console.log(`Submission ${submission.id} Accepted`);

  } catch (error) {
    console.error(
      `Error while processing submission ${submissionId}:`,
      error
    );

    // Prevent the submission from remaining in Pending state
    // if an unexpected error occurs.
    if (submission) {
      try {
        await submissionRepository.updateSubmissionStatus(
          submission.id,
          "Runtime Error"
        );
      } catch (statusError) {
        console.error(
          "Failed to update submission status:",
          statusError
        );
      }
    }

    throw error;

  } finally {
    // Remove temporary files after execution is finished.
    if (folderPath) {
      try {
        await deleteSubmissionFolder(folderPath);
        console.log("Temporary submission folder deleted");
      } catch (cleanupError) {
        console.error(
          "Failed to delete temporary folder:",
          cleanupError
        );
      }
    }
  }
};

const runSourceCode = async (problemData) => {
  const tempId = Date.now();

  const folderPath = await createSubmissionFile(
    tempId,
    problemData.code,
    problemData.language
  );

  try {
    const hasCustomInput =
      problemData.input !== undefined &&
      problemData.input !== null &&
      problemData.input.trim() !== "";

    if (hasCustomInput) {

      const output = await executeCode(
        folderPath,
        problemData.language.toLowerCase(),
        problemData.code,
        problemData.input
      );

      return {
        status: "Success",
        actualOutput: output,
        expectedOutput: problemData.expectedOutput || "",
        passed: problemData.expectedOutput
          ? compareOutput(
            output,
            problemData.expectedOutput
          )
          : true,
      };
    }

    // Run the code using the sample test cases.
    const sampleTestCases =
      await testCaseRepository.fetchSampleTestCases(
        problemData.problemId
      );

    if (sampleTestCases && sampleTestCases.length > 0) {
      const results = [];

      for (let i = 0; i < sampleTestCases.length; i++) {
        const testCase = sampleTestCases[i];

        const output = await executeCode(
          folderPath,
          problemData.language.toLowerCase(),
          problemData.code,
          testCase.question_input || ""
        );

        results.push({
          sample: i + 1,
          actualOutput: output,
          expectedOutput: testCase.expected_output,
          passed: compareOutput(
            output,
            testCase.expected_output
          ),
        });
      }

      return {
        status: "Success",
        results,
      };
    }

    // If there are no sample test cases, run with empty input.
    const output = await executeCode(
      folderPath,
      problemData.language.toLowerCase(),
      problemData.code,
      ""
    );

    return {
      status: "Success",
      actualOutput: output,
      expectedOutput: "",
      passed: true,
    };

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
  return await submissionRepository.fetchProblemSubmissions(
    userId,
    problemId
  );
};

module.exports = {
  createSubmission,
  processSubmission,
  getSubmission,
  fetchAllSubmissions,
  runSourceCode,
  fetchProblemSubmissions,
};