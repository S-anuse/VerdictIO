const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  getprofile,
  updateProfile,
  updatePass,
} = require("../controllers/profileController");

router.get("/", isLoggedIn, getprofile);
router.put("/", isLoggedIn, updateProfile);
router.put("/change-password", isLoggedIn, updatePass);

module.exports = router;
