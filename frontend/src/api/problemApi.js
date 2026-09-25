import axiosInstance from "./axios";

const getAllProblems = async (search, difficulty) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (difficulty) {
    params.append("difficulty", difficulty);
  }

  return await axiosInstance.get(`/problems?${params.toString()}`);
};

const getProblemById = async (id) => {
  return await axiosInstance.get(`/problems/${id}`);
};

const createProblem = async (problemData) => {
  return await axiosInstance.post("/problems", problemData);
};

const updateProblem = async (problemId, problemData) => {
  return await axiosInstance.put(`/problems/${problemId}`, problemData);
};

const deleteProblem = async (problemId) => {
  return await axiosInstance.delete(`/problems/${problemId}`);
};

const createTestCase = async (problemId, testCaseData) => {
  return await axiosInstance.post(`/problems/${problemId}/testcases`, testCaseData);
};

const getTestCases = async (problemId) => {
  return await axiosInstance.get(`/testcases/${problemId}`);
};

export default {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  createTestCase,
  getTestCases,
};
