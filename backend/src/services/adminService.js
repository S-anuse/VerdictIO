const adminRepository = require("../repositories/adminRepository");

async function getAllUsers() {
  return await adminRepository.getAllUsers();
}

async function updateUserRole(userId, role) {
  if (role !== "admin" && role !== "user") {
    throw new Error("Invalid role specified. Role must be 'admin' or 'user'");
  }
  return await adminRepository.updateUserRole(userId, role);
}

async function deleteUser(userId) {
  return await adminRepository.deleteUser(userId);
}

async function updateProblem(problemId, problemData) {
  return await adminRepository.updateProblem(problemId, problemData);
}

async function deleteProblem(problemId) {
  return await adminRepository.deleteProblem(problemId);
}

async function deleteTestCase(testCaseId) {
  return await adminRepository.deleteTestCase(testCaseId);
}

async function getAdminStats() {
  return await adminRepository.getAdminStats();
}

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProblem,
  deleteProblem,
  deleteTestCase,
  getAdminStats,
};
