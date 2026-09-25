const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");

const {
  createTestCase,
  getTestCase,
} = require("../controllers/testCaseController");

router.post("/:problemId", isLoggedIn, createTestCase);
router.get("/:problemId", isLoggedIn, getTestCase);

module.exports = router;
