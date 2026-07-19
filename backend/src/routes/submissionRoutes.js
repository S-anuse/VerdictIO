const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createSubmission,
  getSubmission,
  fetchAllSubmissions,
  runSourceCode,
  fetchProblemSubmissions,
} = require("../controllers/submissionController");

router.post("/run", isLoggedIn, runSourceCode);
router.get("/problem/:problemId", isLoggedIn, fetchProblemSubmissions);
router.get("/", isLoggedIn, fetchAllSubmissions);
router.get("/:id", isLoggedIn, getSubmission);
router.post("/", isLoggedIn, createSubmission);
module.exports = router;
