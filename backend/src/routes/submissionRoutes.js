const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createSubmission,
  getSubmission,
  fetchAllSubmissions,
  runSourceCode,
} = require("../controllers/submissionController");

router.post("/", isLoggedIn, createSubmission);
router.get("/:id", isLoggedIn, getSubmission);
router.get("/", isLoggedIn, fetchAllSubmissions);
router.post("/run", isLoggedIn, runSourceCode);
module.exports = router;
