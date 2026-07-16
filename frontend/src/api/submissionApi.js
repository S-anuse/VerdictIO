import axiosInstance from "./axios";

const runCode = async (data) => {
  return await axiosInstance.post("/submissions/run", data);
};
const submit = async (data) => {
  return await axiosInstance.post("/submissions", data);
};

export default { runCode, submit };
