import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import problemApi from "../api/problemApi";
import submissionApi from "../api/submissionApi";
import Editor from "@monaco-editor/react";

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState(
    `#include <iostream>
using namespace std;

int main() {

    return 0;
}`,
  );
  const [language, setLanguage] = useState("cpp");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [activeTab, setActiveTab] = useState("input");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTabDetails, setActiveTabDetails] = useState("description");
  const [problemSubmissions, setProblemSubmissions] = useState([]);

  const fetchProblem = async () => {
    try {
      const response = await problemApi.getProblemById(id);
      setProblem(response.data.problem);
      setSampleTestCases(response.data.sampleTestCases);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setSubmissionResult(null);
    const data = {
      problemId: id,
      language,
      sourceCode: code,
      input: customInput,
      expectedOutput: customOutput,
    };
    const response = await submissionApi.runCode(data);

    const result = response.data;

    if (result.status !== "Success") {
      setRunResult({
        status: result.status,
        actualOutput: "",
        expectedOutput: "",
        passed: false,
      });

      return;
    }

    setRunResult(result);
    setActiveTab("output");
  };

  const pollSubmission = (submissionId) => {
    const interval = setInterval(async () => {
      const response = await submissionApi.getSubmission(submissionId);
      const submission = response.data.submission;
      console.log(submission.status);
      setSubmissionResult(submission);

      if (submission.status !== "Pending" && submission.status !== "Running") {
        clearInterval(interval);
        setIsSubmitting(false);

        fetchProblemSubmissions();
      }
    }, 2000);
  };

  const handleSubmitCode = async () => {
    setRunResult(null);
    setActiveTab("output");
    const data = {
      problemId: id,
      language,
      source_code: code,
    };
    setIsSubmitting(true);
    const response = await submissionApi.submit(data);
    const submissionId = response.data.submission.id;
    setActiveTabDetails("submissions");
    fetchProblemSubmissions();
    pollSubmission(submissionId);
    console.log("Submission ID:", submissionId);
  };

  const fetchProblemSubmissions = async () => {
    const response = await submissionApi.getProblemSubmissions(id);
    setProblemSubmissions(response.data.result);
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!problem) return <h1>No Problem Found</h1>;

  return (
    <div className="h-screen bg-slate-100 p-4">
      <div className="flex h-full gap-4">
        {/* Left Panel */}
        <div className="w-1/2 bg-white rounded-2xl border border-gray-200 shadow-xl p-8 overflow-y-auto">
          <Link
            to="/problems"
            className="inline-flex items-center text-blue-600 hover:underline mb-6"
          >
            ← Back to Problems
          </Link>

          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">
              {problem.id}. {problem.title}
            </h1>

            <span
              className={`px-5 py-1 shadow-sm rounded-full font-semibold ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          <div className="flex border-b border-gray-200 mt-6">
            <button
              onClick={() => setActiveTabDetails("description")}
              className={`px-6 py-3 font-semibold border-b-2 transition-all duration-200 ${
                activeTabDetails === "description"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              Description
            </button>

            <button
              onClick={() => {
                setActiveTabDetails("submissions");
                fetchProblemSubmissions();
              }}
              className={`px-6 py-3 font-semibold border-b-2 transition-all duration-200 ${
                activeTabDetails === "submissions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              My Submissions
            </button>
          </div>

          {activeTabDetails === "description" && (
            <>
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>

                <p className="leading-7">{problem.description}</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Constraints</h2>

                <pre className="bg-slate-100 rounded-xl p-5 font-mono text-sm whitespace-pre-wrap">
                  {problem.problem_constraints}
                </pre>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Sample Test Cases
                </h2>

                {sampleTestCases.map((sampleTestCase, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl bg-white shadow-sm p-6 mb-6"
                  >
                    <h3 className="font-semibold mb-3">Sample {index + 1}</h3>

                    <p className="font-medium">Input</p>

                    <pre className="bg-slate-100 rounded p-3 mb-4">
                      {sampleTestCase.question_input}
                    </pre>

                    <p className="font-medium">Output</p>

                    <pre className="bg-slate-100 rounded-xl p-4 font-mono text-sm">
                      {sampleTestCase.expected_output}
                    </pre>
                  </div>
                ))}
              </section>
            </>
          )}
          {activeTabDetails === "submissions" && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                My Submissions
              </h2>

              {problemSubmissions.length === 0 ? (
                <p className="text-gray-500">No submissions yet.</p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
                  <table className="w-full border-collapse mt-4">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Language
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Submitted At
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {problemSubmissions.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
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
                            {submission.language === "cpp"
                              ? "C++"
                              : submission.language === "java"
                                ? "Java"
                                : "Python"}
                          </td>

                          <td className="px-4 py-3">
                            {new Date(submission.created_at).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col h-full">
          <div className="bg-slate-50 border-b border-gray-200 px-5 py-3 flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-wide text-gray-800">
              Code Editor
            </h2>

            <select
              className="border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </div>
          <div className="border-t min-h-[60px]">
            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-white py-1 rounded-xl font-semibold shadow-lg"
                onClick={handleRunCode}
              >
                Run Code
              </button>

              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-white py-1 rounded-xl font-semibold shadow-lg"
                onClick={handleSubmitCode}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("input")}
                className={`flex-1 py-1 font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === "input"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
              >
                Input
              </button>

              <button
                onClick={() => setActiveTab("output")}
                className={`flex-1 py-1 font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === "output"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
              >
                Output
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "input" ? (
                <>
                  <h3 className="font-semibold mb-2">Custom Input</h3>

                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input..."
                    className="w-full h-14 bg-slate-50 border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <h3 className="font-semibold mt-2 mb-2">Expected Output</h3>

                  <textarea
                    value={customOutput}
                    onChange={(e) => setCustomOutput(e.target.value)}
                    placeholder="Enter expected output..."
                    className="w-full h-14 bg-slate-50 border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <div className="h-48 overflow-y-auto bg-slate-50 border border-gray-200 rounded-xl p-4 shadow-inner">
                  {runResult ? (
                    runResult.status !== "Success" ? (
                      <p className="text-red-600 font-bold">
                        {runResult.status}
                      </p>
                    ) : runResult.results ? (
                      runResult.results.map((result) => (
                        <div
                          key={result.sample}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4"
                        >
                          <p className="font-bold mb-2">
                            Sample {result.sample}
                          </p>

                          <p>
                            <b>Your Output:</b>
                          </p>

                          <pre>{result.actualOutput}</pre>

                          <p className="mt-2">
                            <b>Expected Output:</b>
                          </p>

                          <pre>{result.expectedOutput}</pre>

                          <span
                            className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold ${
                              result.passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {result.passed ? "✅ Passed" : "❌ Failed"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <p>
                          <b>Your Output</b>
                        </p>

                        <pre>{runResult.actualOutput}</pre>

                        <p className="mt-2">
                          <b>Expected Output</b>
                        </p>

                        <pre>{runResult.expectedOutput}</pre>

                        <span
                          className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold ${
                            runResult.passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {runResult.passed ? "✅ Passed" : "❌ Failed"}
                        </span>
                      </>
                    )
                  ) : submissionResult ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                      <h3 className="font-bold mb-4">Submission Result</h3>
                      <p>
                        <b>Status:</b> {submissionResult.status}
                      </p>
                      <p className="mt-2">
                        <b>Language:</b> {submissionResult.language}
                      </p>
                      <p className="mt-2">
                        <b>Submission ID:</b> {submissionResult.id}
                      </p>
                      <span
                        className={`inline-block mt-4 px-4 py-1 rounded-full font-bold ${
                          submissionResult.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : submissionResult.status === "Running" ||
                                submissionResult.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {submissionResult.status}
                      </span>
                    </div>
                  ) : (
                    <p>No output yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
