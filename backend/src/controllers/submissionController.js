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

const getSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await submissionService.getSubmission(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "No submission yet" });
    } else {
      return res
        .status(200)
        .json({ message: "Submission fetched successfully", submission });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to load submissions" });
  }
};
module.exports = { createSubmission, getSubmission };
