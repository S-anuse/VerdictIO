const submissioRepository = require("../repositories/submissionRepository");
const createSubmissionFile =
  require("../utils/fileHandler").createSubmissionFile;
const { executeCppCode } = require("../utils/dockerExecutor");

const createSubmission = async (submissionData) => {
  try {
    const submission =
      await submissioRepository.createSubmission(submissionData);
    const folderPath = await createSubmissionFile(
      submission.id,
      submission.source_code,
    );
    const output = await executeCppCode(folderPath);
    console.log(output);
    return submission;
  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to create submission");
  }
};
module.exports = { createSubmission };
