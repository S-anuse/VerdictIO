const submissioRepository = require("../repositories/submissionRepository");

const createSubmission = async (submissionData) => {
  try {
    const submission =
      await submissioRepository.createSubmission(submissionData);
    return submission;
  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to create submission");
  }
};
module.exports = { createSubmission };
