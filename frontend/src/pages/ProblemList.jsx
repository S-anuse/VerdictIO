import { useState, useEffect } from "react";
import problemApi from "../api/problemApi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProblemList() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Create/Edit Problem Modal State
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [problemForm, setProblemForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    problem_constraints: "",
    time_limit: 2,
    memory_limit: 256,
    testCases: [
      { question_input: "", expected_output: "", is_hidden: false },
    ],
  });

  // Separate Test Cases Modal State (for existing problems)
  const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [existingTestCases, setExistingTestCases] = useState([]);
  const [testCasesLoading, setTestCasesLoading] = useState(false);
  const [newTestCaseForm, setNewTestCaseForm] = useState({
    question_input: "",
    expected_output: "",
    is_hidden: false,
  });

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

  // Open Create Problem Modal
  const openCreateProblemModal = () => {
    setEditingProblem(null);
    setProblemForm({
      title: "",
      description: "",
      difficulty: "Easy",
      problem_constraints: "",
      time_limit: 2,
      memory_limit: 256,
      testCases: [
        { question_input: "", expected_output: "", is_hidden: false },
      ],
    });
    setIsProblemModalOpen(true);
  };

  // Open Edit Problem Modal
  const openEditProblemModal = async (problem) => {
    try {
      setEditingProblem(problem);
      const res = await problemApi.getProblemById(problem.id);
      const data = res.data.problem || res.data;
      setProblemForm({
        title: data.title || problem.title,
        description: data.description || "",
        difficulty: data.difficulty || problem.difficulty,
        problem_constraints: data.problem_constraints || "",
        time_limit: data.time_limit || 2,
        memory_limit: data.memory_limit || 256,
        testCases: [],
      });
      setIsProblemModalOpen(true);
    } catch (err) {
      alert("Failed to fetch problem details for editing");
    }
  };

  // Dynamic testcase row handlers inside Create/Edit modal
  const handleAddInlineTestCase = () => {
    setProblemForm((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { question_input: "", expected_output: "", is_hidden: false },
      ],
    }));
  };

  const handleRemoveInlineTestCase = (index) => {
    setProblemForm((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const handleInlineTestCaseChange = (index, field, value) => {
    setProblemForm((prev) => {
      const updated = [...prev.testCases];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testCases: updated };
    });
  };

  // Save Problem (Create or Update)
  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        await problemApi.updateProblem(editingProblem.id, problemForm);
        alert("Problem updated successfully!");
      } else {
        await problemApi.createProblem(problemForm);
        alert("Problem created successfully with test cases!");
      }
      setIsProblemModalOpen(false);
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save problem");
    }
  };

  // Delete Problem
  const handleDeleteProblem = async (problemId, problemTitle) => {
    if (!confirm(`Are you sure you want to delete problem "${problemTitle}"?`)) {
      return;
    }

    try {
      await problemApi.deleteProblem(problemId);
      alert("Problem deleted successfully!");
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete problem");
    }
  };

  // Open Separate Test Cases Modal
  const openTestCasesModal = async (problem) => {
    setSelectedProblem(problem);
    setIsTestCaseModalOpen(true);
    fetchTestCases(problem.id);
  };

  const fetchTestCases = async (problemId) => {
    try {
      setTestCasesLoading(true);
      const res = await problemApi.getTestCases(problemId);
      setExistingTestCases(res.data || []);
    } catch (err) {
      console.error("Failed to fetch test cases", err);
      setExistingTestCases([]);
    } finally {
      setTestCasesLoading(false);
    }
  };

  // Add Test Case via modal
  const handleAddSingleTestCase = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;

    try {
      await problemApi.createTestCase(selectedProblem.id, newTestCaseForm);
      alert("Test case added successfully!");
      setNewTestCaseForm({
        question_input: "",
        expected_output: "",
        is_hidden: false,
      });
      fetchTestCases(selectedProblem.id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add test case");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <h1 className="text-xl font-medium text-gray-600">Loading problems...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <h1 className="text-xl font-medium text-red-600">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Problems</h1>

          {/* Any logged in user can create a problem */}
          <button
            onClick={openCreateProblemModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5 self-start sm:self-auto shadow"
          >
            <span>➕ Create Problem</span>
          </button>
        </div>

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
            {problems.map((problem, index) => {
              const canModify =
                user?.role === "admin" || problem.created_by === user?.id;
              return (
                <tr
                  key={problem.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">
                    {problem.title}
                    {problem.created_by === user?.id && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-normal">
                        Your Problem
                      </span>
                    )}
                  </td>

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
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/problems/${problem.id}`}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition inline-block text-sm"
                      >
                        Solve →
                      </Link>

                      {/* Can edit/delete ONLY if admin OR creator of this problem */}
                      {canModify && (
                        <>
                          <button
                            onClick={() => openTestCasesModal(problem)}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                            title="Manage Test Cases"
                          >
                            🧪 Test Cases
                          </button>

                          <button
                            onClick={() => openEditProblemModal(problem)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                            title="Edit Problem"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProblem(problem.id, problem.title)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                            title="Delete Problem"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* MODAL 1: CREATE / EDIT PROBLEM (WITH INLINE TEST CASES) */}
        {isProblemModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8 border">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProblem
                    ? `Edit Problem #${editingProblem.id}`
                    : "Create New Problem"}
                </h3>
                <button
                  onClick={() => setIsProblemModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProblem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={problemForm.title}
                    onChange={(e) =>
                      setProblemForm({ ...problemForm, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Sum of Two Integers"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={problemForm.difficulty}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Time Limit (sec)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={problemForm.time_limit}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          time_limit: parseInt(e.target.value) || 2,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Memory Limit (MB)
                    </label>
                    <input
                      type="number"
                      min="16"
                      value={problemForm.memory_limit}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          memory_limit: parseInt(e.target.value) || 256,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Problem Description *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={problemForm.description}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe problem statement and inputs/outputs..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Constraints & Hints
                  </label>
                  <textarea
                    rows="2"
                    value={problemForm.problem_constraints}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        problem_constraints: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1 <= N <= 10^5"
                  ></textarea>
                </div>

                {/* INLINE TEST CASES SECTION (ONLY ON CREATION) */}
                {!editingProblem && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-800">
                        🧪 Test Cases (Optional during creation)
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddInlineTestCase}
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold px-3 py-1 rounded"
                      >
                        + Add Test Case
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {problemForm.testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border rounded-lg p-3 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-gray-700">
                            <span>Test Case #{idx + 1}</span>
                            {problemForm.testCases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveInlineTestCase(idx)}
                                className="text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-gray-600 mb-1 font-mono">
                                Standard Input (stdin)
                              </label>
                              <textarea
                                rows="2"
                                value={tc.question_input}
                                onChange={(e) =>
                                  handleInlineTestCaseChange(
                                    idx,
                                    "question_input",
                                    e.target.value
                                  )
                                }
                                className="w-full border rounded p-1.5 font-mono text-xs text-gray-900"
                                placeholder="Input..."
                              />
                            </div>

                            <div>
                              <label className="block text-gray-600 mb-1 font-mono">
                                Expected Output (stdout)
                              </label>
                              <textarea
                                rows="2"
                                value={tc.expected_output}
                                onChange={(e) =>
                                  handleInlineTestCaseChange(
                                    idx,
                                    "expected_output",
                                    e.target.value
                                  )
                                }
                                className="w-full border rounded p-1.5 font-mono text-xs text-gray-900"
                                placeholder="Expected output..."
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={tc.is_hidden}
                              onChange={(e) =>
                                handleInlineTestCaseChange(
                                  idx,
                                  "is_hidden",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-gray-700 font-medium">
                              Hidden Test Case (🔒 Hidden from problem view)
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsProblemModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm bg-gray-600 hover:bg-gray-700 text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                  >
                    {editingProblem ? "Save Changes" : "Create Problem"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: SEPARATE TEST CASES MANAGEMENT MODAL */}
        {isTestCaseModalOpen && selectedProblem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 border">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Test Cases: #{selectedProblem.id} - {selectedProblem.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configure sample and hidden test cases for this problem.
                  </p>
                </div>
                <button
                  onClick={() => setIsTestCaseModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Add New Test Case Form */}
              <form
                onSubmit={handleAddSingleTestCase}
                className="bg-slate-50 p-4 rounded-xl border space-y-3"
              >
                <h4 className="text-sm font-bold text-blue-600">
                  ➕ Add New Test Case
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">
                      Standard Input (stdin)
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={newTestCaseForm.question_input}
                      onChange={(e) =>
                        setNewTestCaseForm({
                          ...newTestCaseForm,
                          question_input: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2.5 text-xs text-mono text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Input data..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-700 mb-1">
                      Expected Output (stdout)
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={newTestCaseForm.expected_output}
                      onChange={(e) =>
                        setNewTestCaseForm({
                          ...newTestCaseForm,
                          expected_output: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2.5 text-xs text-mono text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Expected output..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newTestCaseForm.is_hidden}
                      onChange={(e) =>
                        setNewTestCaseForm({
                          ...newTestCaseForm,
                          is_hidden: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      Hide this test case from user problem statement (Hidden
                      Test Case)
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Save Test Case
                  </button>
                </div>
              </form>

              {/* List of Existing Test Cases */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  Existing Test Cases ({existingTestCases.length})
                </h4>

                {testCasesLoading ? (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    Loading test cases...
                  </div>
                ) : existingTestCases.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs border border-dashed rounded-xl">
                    No test cases added yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {existingTestCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        className="bg-slate-50 border rounded-xl p-3 flex flex-col md:flex-row justify-between md:items-center gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1 font-mono">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">
                              Case #{idx + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tc.is_hidden
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-green-100 text-green-800 border border-green-300"
                              }`}
                            >
                              {tc.is_hidden ? "🔒 Hidden" : "👁️ Sample"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-gray-600">
                            <div>
                              <span className="text-gray-400 block">Input:</span>
                              <pre className="bg-white p-1.5 rounded border text-gray-800 overflow-x-auto whitespace-pre-wrap">
                                {tc.question_input || "<empty>"}
                              </pre>
                            </div>
                            <div>
                              <span className="text-gray-400 block">
                                Expected:
                              </span>
                              <pre className="bg-white p-1.5 rounded border text-gray-800 overflow-x-auto whitespace-pre-wrap">
                                {tc.expected_output || "<empty>"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemList;
