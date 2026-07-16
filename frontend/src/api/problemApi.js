import axiosInstance from "./axios";

const getAllProblems = async () => {
  return await axiosInstance.get("/problems");
};
const getProblemById = async (id) => {
  return await axiosInstance.get(`/problems/${id}`);
};

export default { getAllProblems, getProblemById };
