import axiosInstance from "./axios";

const runCode = async (data) => {
  return await axiosInstance.post("/submissions/run", data);
};

export default { runCode };
