import axiosInstance from "./axios";

const getDashboard = async () => {
  return await axiosInstance.get("/dashboard");
};

export default { getDashboard };
