const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { isAdminLoggedIn } = require("../middleware/adminMiddleware");
const { createProblem } = require("../controllers/problemController");

router.post("/", isLoggedIn, isAdminLoggedIn, createProblem);

module.exports = router;
