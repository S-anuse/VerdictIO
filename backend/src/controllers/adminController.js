const adminService = require("../services/adminService");

async function getUsers(req, res) {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
}

async function changeUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await adminService.updateUserRole(id, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Failed to update user role" });
  }
}

async function removeUser(req, res) {
  const { id } = req.params;
  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "Cannot delete your own admin account" });
  }
  try {
    const deletedUser = await adminService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
}

async function editProblem(req, res) {
  const { id } = req.params;
  try {
    const updatedProblem = await adminService.updateProblem(id, req.body);
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem updated successfully", problem: updatedProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update problem", error: error.message });
  }
}

async function removeProblem(req, res) {
  const { id } = req.params;
  try {
    const deletedProblem = await adminService.deleteProblem(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully", problem: deletedProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete problem", error: error.message });
  }
}

async function removeTestCase(req, res) {
  const { id } = req.params;
  try {
    const deletedTestCase = await adminService.deleteTestCase(id);
    if (!deletedTestCase) {
      return res.status(404).json({ message: "Test case not found" });
    }
    res.status(200).json({ message: "Test case deleted successfully", testCase: deletedTestCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete test case", error: error.message });
  }
}

async function getStats(req, res) {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
}

module.exports = {
  getUsers,
  changeUserRole,
  removeUser,
  editProblem,
  removeProblem,
  removeTestCase,
  getStats,
};
