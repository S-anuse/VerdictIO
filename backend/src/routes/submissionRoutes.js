const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createSubmission,
  getSubmission,
} = require("../controllers/submissionController");

router.post("/", isLoggedIn, createSubmission);
router.get("/:id", isLoggedIn, getSubmission);
module.exports = router;
