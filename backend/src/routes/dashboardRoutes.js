const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { getDetails } = require("../controllers/dashboardController");

router.get("/", isLoggedIn, getDetails);

module.exports = router;
