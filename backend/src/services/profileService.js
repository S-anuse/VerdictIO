const profileRepository = require("../repositories/profileRepository");

const getprofile = async (userId) => {
  const result = await profileRepository.getprofile(userId);
  return result;
};

const updateProfile = async (name, email, userId) => {
  const result = await profileRepository.updateProfile(name, email, userId);

  return result;
};
const updatePass = async (userId, password) => {
  const result = await profileRepository.updatePass(userId, password);
  return result;
};
const getUserPass = async (userId) => {
  const result = await profileRepository.getUserPass(userId);
  return result;
};
module.exports = { getprofile, updateProfile, updatePass, getUserPass };
