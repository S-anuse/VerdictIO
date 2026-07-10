const submissioRepository = require("../repositories/submissionRepository");
const createSubmissionFile = require("../utils/fileHandler").createSubmissionFile;

const createSubmission = async (submissionData) => {
  try {
    const submission =
      await submissioRepository.createSubmission(submissionData);
      await createSubmissionFile(submission.id, submission.source_code);
    return submission;

  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to create submission");
  }
};
module.exports = { createSubmission };
