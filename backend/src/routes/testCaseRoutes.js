const express = require("express");
const router = express.Router();

const {
  createTestCase,
  getTestCase,
} = require("../controllers/testCaseController");

router.post("/:problemId", createTestCase);
router.get("/:problemId", getTestCase);

module.exports = router;
