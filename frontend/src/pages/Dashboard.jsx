import { useEffect, useState } from "react";
import dashboardApi from "../api/dashboardApi";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardApi.getDashboard();
      setDashboard(response.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) return <h1>Loading...</h1>;

  const { statistics, recentSubmissions } = dashboard;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-lg font-semibold text-gray-600">Total Solved</h2>

          <p className="text-4xl font-bold text-green-600 mt-4">
            {statistics.totalSolved}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Submissions
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-4">
            {statistics.totalSubmissions}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-lg font-semibold text-gray-600">
            Acceptance Rate
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-4">
            {statistics.acceptanceRate}%
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Recent Submissions</h2>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Problem
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Language
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Submitted At
              </th>
            </tr>
          </thead>

          <tbody>
            {recentSubmissions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              recentSubmissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{submission.title}</td>

                  <td className="px-4 py-3">
                    {submission.language === "cpp"
                      ? "C++"
                      : submission.language === "java"
                        ? "Java"
                        : submission.language === "javascript"
                          ? "JavaScript"
                          : "Python"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        submission.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : submission.status === "Pending" ||
                              submission.status === "Running"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(submission.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
