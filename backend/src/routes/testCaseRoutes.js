const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { isAdminLoggedIn } = require("../middleware/adminMiddleware");

const {
  createTestCase,
  getTestCase,
} = require("../controllers/testCaseController");

router.post("/:problemId", isLoggedIn, isAdminLoggedIn, createTestCase);
router.get("/:problemId", isLoggedIn, isAdminLoggedIn, getTestCase);

module.exports = router;
