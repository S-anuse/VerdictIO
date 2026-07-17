import { useEffect, useState } from "react";
import submissionApi from "../api/submissionApi";

function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSubmissions = async () => {
    try {
      const response = await submissionApi.getAllSubmissions();
      setSubmissions(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);
  console.log(submissions);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Submission History</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Submission History</h1>
        <p>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Submission History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-center">Submission ID</th>
              <th className="border px-4 py-2 text-center">Problem</th>
              <th className="border px-4 py-2 text-center">Language</th>
              <th className="border px-4 py-2 text-center">Status</th>
              <th className="border px-4 py-2 text-center">Submitted At</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className={
                  submission.id % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }
              >
                <td className="border px-4 py-2 text-center">
                  {submission.id}
                </td>
                <td className="border px-4 py-2 text-center">
                  {submission.title}
                </td>
                <td className="border px-4 py-2 text-center">
                  {submission.language}
                </td>
                <td className="border px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      submission.status === "Accepted"
                        ? "bg-green-500"
                        : submission.status === "Wrong Answer"
                          ? "bg-red-500"
                          : submission.status === "Running"
                            ? "bg-yellow-500"
                            : submission.status === "Compilation Error"
                              ? "bg-blue-500"
                              : "bg-orange-500"
                    }`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  {new Date(submission.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubmissionHistory;
