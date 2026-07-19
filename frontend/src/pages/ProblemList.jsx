import { useState, useEffect } from "react";
import problemApi from "../api/problemApi";
import { Link } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const fetchProblems = async () => {
    try {
      const response = await problemApi.getAllProblems(search, difficulty);
      setProblems(response.data.result || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Problems</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Problem</th>
              <th className="p-3 text-left">Difficulty</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3 font-medium">{problem.title}</td>

                <td
                  className={`p-3 font-semibold ${
                    problem.difficulty === "Easy"
                      ? "text-green-600"
                      : problem.difficulty === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </td>

                <td className="p-3 text-center">
                  <Link
                    to={`/problems/${problem.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
                  >
                    Solve →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemList;
