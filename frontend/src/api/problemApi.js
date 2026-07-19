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

export default { getAllProblems, getProblemById };
