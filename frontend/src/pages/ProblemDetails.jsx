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
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);
  console.log(id);

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!problem) return <h1>No Problem Found</h1>;

  return (
    <div className="h-screen bg-slate-100 p-4">
      <div className="flex h-full gap-4">
        {/* Left Panel */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          <Link
            to="/problems"
            className="inline-flex items-center text-blue-600 hover:underline mb-6"
          >
            ← Back to Problems
          </Link>

          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-3xl font-bold">
              {problem.id}. {problem.title}
            </h1>

            <span
              className={`px-4 py-1 rounded-full font-semibold ${
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

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>

            <p className="leading-7">{problem.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Constraints</h2>

            <pre className="bg-slate-100 rounded-lg p-4 whitespace-pre-wrap">
              {problem.problem_constraints}
            </pre>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Sample Test Cases</h2>

            {sampleTestCases.map((sampleTestCase, index) => (
              <div
                key={index}
                className="border rounded-xl bg-slate-50 p-5 mb-5"
              >
                <h3 className="font-semibold mb-3">Sample {index + 1}</h3>

                <p className="font-medium">Input</p>

                <pre className="bg-slate-100 rounded p-3 mb-4">
                  {sampleTestCase.question_input}
                </pre>

                <p className="font-medium">Output</p>

                <pre className="bg-slate-100 rounded p-3">
                  {sampleTestCase.expected_output}
                </pre>
              </div>
            ))}
          </section>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg flex flex-col">
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Code Editor</h2>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="h-[400px]">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Custom Input</h3>

            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input..."
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Expected Output</h3>

            <textarea
              value={customOutput}
              onChange={(e) => setCustomOutput(e.target.value)}
              placeholder="Enter expected output..."
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="flex gap-4 p-4">
            <button
              className="flex-1 bg-blue-600 text-white px-5 py-2 rounded-lg"
              onClick={handleRunCode}
            >
              Run Code
            </button>

            <button className="flex-1 bg-green-600 text-white px-5 py-2 rounded-lg">
              Submit
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Output</h3>

            <div className="bg-slate-100 rounded-lg p-3 min-h-[120px]">
              {runResult ? (
                runResult.status !== "Success" ? (
                  <p className="text-red-600 font-bold">{runResult.status}</p>
                ) : runResult.results ? (
                  runResult.results.map((result) => (
                    <div
                      key={result.sample}
                      className="border-b border-gray-300 mb-4 pb-4"
                    >
                      <p className="font-bold mb-2">Sample {result.sample}</p>

                      <p className="font-semibold">Your Output</p>
                      <pre className="mb-3 whitespace-pre-wrap">
                        {result.actualOutput || "No Output"}
                      </pre>

                      <p className="font-semibold">Expected Output</p>
                      <pre className="mb-3 whitespace-pre-wrap">
                        {result.expectedOutput || "No Expected Output"}
                      </pre>

                      <p
                        className={`font-bold ${
                          result.passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.passed ? "✅ Passed" : "❌ Failed"}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <p className="font-semibold">Your Output</p>

                    <pre className="mb-4 whitespace-pre-wrap">
                      {runResult.actualOutput || "No Output"}
                    </pre>

                    <p className="font-semibold">Expected Output</p>

                    <pre className="mb-4 whitespace-pre-wrap">
                      {runResult.expectedOutput || "No Expected Output"}
                    </pre>

                    <p
                      className={`font-bold ${
                        runResult.passed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {runResult.passed ? "✅ Passed" : "❌ Failed"}
                    </p>
                  </>
                )
              ) : (
                <p>No output yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
