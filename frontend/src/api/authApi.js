import axiosInstance from "./axios";

const register = async (userData) => {
  return await axiosInstance.post("/auth/register", userData);
};

const login = async (userData) => {
  return await axiosInstance.post("/auth/login", userData);
};

const getMe = async () => {
  return await axiosInstance.get("/auth/me");
};

export default { register, login, getMe };
