const profileService = require("../services/profileService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getprofile = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await profileService.getprofile(userId);

    if (!result) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    return res.status(200).json({
      message: "User found successfully",
      result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Unable to retrieve data",
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;
  try {
    const result = await profileService.updateProfile(name, email, userId);
    return res.status(200).json({
      message: "Profile updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500);
  }
};

const updatePass = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await profileService.getUserPass(userId);
    const pass = await bcrypt.compare(currentPassword, user.password);
    if (!pass)
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    const result = await profileService.updatePass(userId, hash);
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { getprofile, updateProfile, updatePass };
