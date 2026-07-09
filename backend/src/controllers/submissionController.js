const createSubmission = async (req , res) => {
    res.status(200).json({ message: "Submission created successfully" });
}
module.exports = { createSubmission };