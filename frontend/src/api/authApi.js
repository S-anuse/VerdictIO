import axiosInstance from "./axios";

const register = async (userData) => {
  return await axiosInstance.post("/auth/register", userData);
};
const login = async (userData) => {
  return await axiosInstance.post("/auth/login", userData);
};
export default { register, login };
