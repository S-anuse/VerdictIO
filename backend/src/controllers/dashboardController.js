const dashboardService = require("../services/dashboardService");

const getDetails = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await dashboardService.getDashboard(userId);
    return res.status(200).json({ message: "Data retrieved", result });
  } catch (err) {
    return res.status(500).json({ message: "Data not retrived" });
  }
};
module.exports = { getDetails };
