import axiosInstance from "./axios";

const getProfile = async () => {
  return await axiosInstance.get("/profile");
};
const updateProfile = async (data) => {
  return await axiosInstance.put("/profile", data);
};
const changePassword = async (data) => {
  return await axiosInstance.put("/profile/change-password", data);
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
