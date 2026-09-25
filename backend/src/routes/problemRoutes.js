const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");
const { createTestCase } = require("../controllers/testCaseController");

// Problem creation: any logged in user can create a problem
router.post("/", isLoggedIn, createProblem);

// Testcase creation for a problem
router.post("/:problemId/testcases", isLoggedIn, createTestCase);

// Read problems
router.get("/", isLoggedIn, getAllProblems);
router.get("/:id", isLoggedIn, getProblem);

// Update / Delete problem (Authorization check inside controller: Admin can edit/delete any problem; User can edit/delete only owned problems)
router.put("/:id", isLoggedIn, updateProblem);
router.delete("/:id", isLoggedIn, deleteProblem);

module.exports = router;
