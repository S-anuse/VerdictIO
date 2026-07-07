const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { isAdminLoggedIn } = require("../middleware/adminMiddleware");
const { createProblem } = require("../controllers/problemController");
const { createTestCase } = require("../controllers/testCaseController");

router.post("/", isLoggedIn, isAdminLoggedIn, createProblem);
router.post(
  "/:problemId/testcases",
  isLoggedIn,
  isAdminLoggedIn,
  createTestCase,
);

module.exports = router;
