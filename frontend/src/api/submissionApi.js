import axiosInstance from "./axios";

const runCode = async (data) => {
  return await axiosInstance.post("/submissions/run", data);
};
const submit = async (data) => {
  return await axiosInstance.post("/submissions", data);
};
const getSubmission = async (id) => {
  return await axiosInstance.get(`/submissions/${id}`);
};
const getAllSubmissions = async () => {
  return await axiosInstance.get("/submissions");
};

export default { runCode, submit, getSubmission, getAllSubmissions };
