const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const { isAdminLoggedIn } = require("../middleware/adminMiddleware");
const {
  getUsers,
  changeUserRole,
  removeUser,
  editProblem,
  removeProblem,
  removeTestCase,
  getStats,
} = require("../controllers/adminController");

// Protect all admin routes with authentication and admin role check
router.use(isLoggedIn, isAdminLoggedIn);

// Admin dashboard stats
router.get("/stats", getStats);

// User management routes
router.get("/users", getUsers);
router.patch("/users/:id/role", changeUserRole);
router.delete("/users/:id", removeUser);

// Problem management routes
router.put("/problems/:id", editProblem);
router.delete("/problems/:id", removeProblem);

// Test case management routes
router.delete("/testcases/:id", removeTestCase);

module.exports = router;
