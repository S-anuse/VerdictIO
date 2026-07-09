const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { createSubmission } = require("../controllers/submissionController");

router.post("/", isLoggedIn, createSubmission);
module.exports = router;
