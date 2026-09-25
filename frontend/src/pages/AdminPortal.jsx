import { useState, useEffect } from "react";
import adminApi from "../api/adminApi";
import problemApi from "../api/problemApi";
import { useAuth } from "../context/AuthContext";

function AdminPortal() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("users"); // users, problems

  // Users management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  // Problems management state
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemSearch, setProblemSearch] = useState("");

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
  });

  // Test Cases Modal State
  const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [testCasesLoading, setTestCasesLoading] = useState(false);
  const [testCaseForm, setTestCaseForm] = useState({
    question_input: "",
    expected_output: "",
    is_hidden: false,
  });

  // Notifications / Alert message
  const [message, setMessage] = useState({ text: "", type: "" });

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      showNotification("Failed to load users list", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch Problems
  const fetchProblems = async () => {
    try {
      setProblemsLoading(true);
      const res = await problemApi.getAllProblems();
      setProblems(res.data.result || []);
    } catch (err) {
      console.error("Failed to fetch problems", err);
      showNotification("Failed to load problems list", "error");
    } finally {
      setProblemsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProblems();
  }, []);

  // Handle User Role Toggle
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (targetUser.id === currentUser.id) {
      alert("You cannot change your own admin role.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to change ${targetUser.name}'s role to ${newRole.toUpperCase()}?`
      )
    ) {
      return;
    }

    try {
      await adminApi.updateUserRole(targetUser.id, newRole);
      showNotification(`Successfully updated ${targetUser.name}'s role to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update role", "error");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (
      !confirm(
        `DANGER: Are you sure you want to delete user ${targetUser.name} (${targetUser.email})? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await adminApi.deleteUser(targetUser.id);
      showNotification(`User ${targetUser.name} deleted successfully`);
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

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
      });
      setIsProblemModalOpen(true);
    } catch (err) {
      showNotification("Failed to fetch problem details for editing", "error");
    }
  };

  // Save Problem (Create or Update)
  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        await adminApi.updateProblem(editingProblem.id, problemForm);
        showNotification("Problem updated successfully");
      } else {
        await adminApi.createProblem(problemForm);
        showNotification("New problem created successfully");
      }
      setIsProblemModalOpen(false);
      fetchProblems();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to save problem", "error");
    }
  };

  // Delete Problem
  const handleDeleteProblem = async (problemId, problemTitle) => {
    if (
      !confirm(
        `Are you sure you want to delete problem "#${problemId}: ${problemTitle}"? All associated test cases and submissions will also be removed.`
      )
    ) {
      return;
    }

    try {
      await adminApi.deleteProblem(problemId);
      showNotification(`Problem #${problemId} deleted successfully`);
      fetchProblems();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to delete problem", "error");
    }
  };

  // Open Test Cases Modal
  const openTestCasesModal = async (problem) => {
    setSelectedProblem(problem);
    setIsTestCaseModalOpen(true);
    fetchTestCases(problem.id);
  };

  const fetchTestCases = async (problemId) => {
    try {
      setTestCasesLoading(true);
      const res = await adminApi.getTestCases(problemId);
      setTestCases(res.data || []);
    } catch (err) {
      console.error("Failed to fetch test cases", err);
      setTestCases([]);
    } finally {
      setTestCasesLoading(false);
    }
  };

  // Create Test Case
  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;

    try {
      await adminApi.createTestCase(selectedProblem.id, testCaseForm);
      showNotification("Test case added successfully");
      setTestCaseForm({
        question_input: "",
        expected_output: "",
        is_hidden: false,
      });
      fetchTestCases(selectedProblem.id);
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to add test case", "error");
    }
  };

  // Delete Test Case
  const handleDeleteTestCase = async (testCaseId) => {
    if (!confirm("Are you sure you want to delete this test case?")) return;
    try {
      await adminApi.deleteTestCase(testCaseId);
      showNotification("Test case deleted");
      if (selectedProblem) fetchTestCases(selectedProblem.id);
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to delete test case", "error");
    }
  };

  // Filtered Lists
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
      p.difficulty.toLowerCase().includes(problemSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-xl shadow-lg p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-blue-600">Admin Portal</h1>
              <span className="bg-purple-100 text-purple-700 border border-purple-300 text-xs px-3 py-1 rounded-full font-semibold">
                Role-Based Control
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Manage platform users, assign roles, create & edit coding problems, and update test cases.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-lg border">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                activeTab === "users"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              👥 User Roles ({users.length})
            </button>

            <button
              onClick={() => setActiveTab("problems")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                activeTab === "problems"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              🧩 Problems ({problems.length})
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {message.text && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
              message.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage({ text: "", type: "" })}
              className="text-xs font-bold opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: USER ROLE MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
            <div className="p-6 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Accounts & Role Permissions</h2>
                <p className="text-xs text-gray-500">
                  Promote users to Administrator or demote Admins back to standard users.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
              />
            </div>

            {usersLoading ? (
              <div className="p-12 text-center text-gray-500">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white font-medium">
                      <th className="p-3">User ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((u) => {
                      const isSelf = u.id === currentUser?.id;
                      const isAdminRole = u.role === "admin";
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-gray-500 font-mono text-xs">#{u.id}</td>
                          <td className="p-3 font-semibold text-gray-800">
                            {u.name} {isSelf && <span className="text-xs text-blue-600 font-normal">(You)</span>}
                          </td>
                          <td className="p-3 text-gray-600">{u.email}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                isAdminRole
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : "bg-slate-100 text-slate-700 border border-slate-300"
                              }`}
                            >
                              {isAdminRole ? "🛡️ ADMIN" : "👤 USER"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleToggleRole(u)}
                                disabled={isSelf}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition ${
                                  isAdminRole
                                    ? "bg-amber-600 hover:bg-amber-700"
                                    : "bg-purple-600 hover:bg-purple-700"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {isAdminRole ? "Demote to User" : "Promote to Admin"}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u)}
                                disabled={isSelf}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROBLEMS & TEST CASES MANAGEMENT */}
        {activeTab === "problems" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Problem Directory Management</h2>
                <p className="text-xs text-gray-500">
                  Create new coding problems, edit attributes, or configure test cases.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter problems..."
                  value={problemSearch}
                  onChange={(e) => setProblemSearch(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
                />

                <button
                  onClick={openCreateProblemModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5 whitespace-nowrap shadow-md"
                >
                  <span>➕ Create Problem</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              {problemsLoading ? (
                <div className="p-12 text-center text-gray-500">Loading problems...</div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No problems found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white font-medium">
                        <th className="p-3">ID</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Difficulty</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProblems.map((prob) => (
                        <tr key={prob.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-mono text-xs text-gray-500">#{prob.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{prob.title}</td>
                          <td className="p-3">
                            <span
                              className={`font-semibold ${
                                prob.difficulty === "Easy"
                                  ? "text-green-600"
                                  : prob.difficulty === "Medium"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openTestCasesModal(prob)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                              >
                                🧪 Test Cases
                              </button>

                              <button
                                onClick={() => openEditProblemModal(prob)}
                                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition"
                              >
                                ✏️ Edit
                              </button>

                              <button
                                onClick={() => handleDeleteProblem(prob.id, prob.title)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE / EDIT PROBLEM */}
        {isProblemModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 border">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProblem ? `Edit Problem #${editingProblem.id}` : "Create New Problem"}
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
                    onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
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
                        setProblemForm({ ...problemForm, difficulty: e.target.value })
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
                        setProblemForm({ ...problemForm, time_limit: parseInt(e.target.value) || 2 })
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
                      setProblemForm({ ...problemForm, description: e.target.value })
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
                      setProblemForm({ ...problemForm, problem_constraints: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1 <= N <= 10^5"
                  ></textarea>
                </div>

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

        {/* MODAL 2: TEST CASES MANAGEMENT */}
        {isTestCaseModalOpen && selectedProblem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 border">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Test Cases: #{selectedProblem.id} - {selectedProblem.title}
                  </h3>
                  <p className="text-xs text-gray-500">Configure public sample and hidden test cases.</p>
                </div>
                <button
                  onClick={() => setIsTestCaseModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Add New Test Case Form */}
              <form onSubmit={handleAddTestCase} className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <h4 className="text-sm font-bold text-blue-600">➕ Add New Test Case</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Standard Input (stdin)</label>
                    <textarea
                      required
                      rows="3"
                      value={testCaseForm.question_input}
                      onChange={(e) =>
                        setTestCaseForm({ ...testCaseForm, question_input: e.target.value })
                      }
                      className="w-full border rounded-lg p-2.5 text-xs text-mono text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Input data..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Expected Output (stdout)</label>
                    <textarea
                      required
                      rows="3"
                      value={testCaseForm.expected_output}
                      onChange={(e) =>
                        setTestCaseForm({ ...testCaseForm, expected_output: e.target.value })
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
                      checked={testCaseForm.is_hidden}
                      onChange={(e) =>
                        setTestCaseForm({ ...testCaseForm, is_hidden: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Hide this test case from user problem statement (Hidden Test Case)</span>
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
                  Existing Test Cases ({testCases.length})
                </h4>

                {testCasesLoading ? (
                  <div className="text-center py-6 text-gray-500 text-xs">Loading test cases...</div>
                ) : testCases.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs border border-dashed rounded-xl">
                    No test cases added yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {testCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        className="bg-slate-50 border rounded-xl p-3 flex flex-col md:flex-row justify-between md:items-center gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1 font-mono">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">Case #{idx + 1}</span>
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
                              <span className="text-gray-400 block">Expected:</span>
                              <pre className="bg-white p-1.5 rounded border text-gray-800 overflow-x-auto whitespace-pre-wrap">
                                {tc.expected_output || "<empty>"}
                              </pre>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTestCase(tc.id)}
                          className="self-end md:self-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                        >
                          Delete
                        </button>
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

export default AdminPortal;
