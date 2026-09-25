import axiosInstance from "./axios";

const getStats = async () => {
  return await axiosInstance.get("/admin/stats");
};

const getUsers = async () => {
  return await axiosInstance.get("/admin/users");
};

const updateUserRole = async (userId, role) => {
  return await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
};

const deleteUser = async (userId) => {
  return await axiosInstance.delete(`/admin/users/${userId}`);
};

const createProblem = async (problemData) => {
  return await axiosInstance.post("/problems", problemData);
};

const updateProblem = async (problemId, problemData) => {
  return await axiosInstance.put(`/admin/problems/${problemId}`, problemData);
};

const deleteProblem = async (problemId) => {
  return await axiosInstance.delete(`/admin/problems/${problemId}`);
};

const createTestCase = async (problemId, testCaseData) => {
  return await axiosInstance.post(`/problems/${problemId}/testcases`, testCaseData);
};

const getTestCases = async (problemId) => {
  return await axiosInstance.get(`/testcases/${problemId}`);
};

const deleteTestCase = async (testCaseId) => {
  return await axiosInstance.delete(`/admin/testcases/${testCaseId}`);
};

export default {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createProblem,
  updateProblem,
  deleteProblem,
  createTestCase,
  getTestCases,
  deleteTestCase,
};
