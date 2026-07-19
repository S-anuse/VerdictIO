const dashboardRepository = require("../repositories/dashboardRepository");

const getDashboard = async (userId) => {
  const totalSolved = await dashboardRepository.getTotalSolved(userId);

  const totalSubmissions =
    await dashboardRepository.getTotalSubmissions(userId);

  const recentSubmissions =
    await dashboardRepository.getRecentSubmissions(userId);

  const solved = Number(totalSolved.total_solved);

  const submissions = Number(totalSubmissions.total_submissions);

  const acceptanceRate =
    submissions === 0 ? 0 : Math.round((solved / submissions) * 100);

  return {
    statistics: {
      totalSolved: solved,
      totalSubmissions: submissions,
      acceptanceRate,
    },
    recentSubmissions,
  };
};
module.exports = { getDashboard };
