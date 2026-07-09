const submissionService = require("../services/submissionService");

const createSubmission = async (req, res) => {
  const submissionData = {
    ...req.body,
    userId: req.user.id,
    status: "Pending",
  };
  try {
    const submission = await submissionService.createSubmission(submissionData);
    res
      .status(201)
      .json({ message: "Submission created successfully", submission });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create submission" });
  }
};
module.exports = { createSubmission };
