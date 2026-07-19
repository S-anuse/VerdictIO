const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Main executor function
const executeCode = async (
  submissionFolderPath,
  language,
  code,
  input = "",
) => {
  const fileName =
    language === "cpp"
      ? "main.cpp"
      : language === "python"
        ? "main.py"
        : language === "javascript"
          ? "main.js"
          : "main.cpp";

  const fullPath = path.join(submissionFolderPath, fileName);

  // Write code to file
  fs.writeFileSync(fullPath, code);

  if (language === "cpp") {
    return await executeCpp(submissionFolderPath);
  } else if (language === "python") {
    return await executePython(submissionFolderPath, input); // Pass input
  } else if (language === "javascript") {
    return await executeJavaScript(submissionFolderPath);
  } else {
    throw new Error("Unsupported language");
  }
};

const executeCpp = async (folder) => {
  const compileCmd = `g++ ${folder}/main.cpp -o ${folder}/main`;
  const runCmd = `${folder}/main < ${folder}/input.txt`;

  await runCommand(compileCmd, "Compilation Error");
  return await runCommand(runCmd, "Runtime Error");
};

const executePython = async (folder, input = "") => {
  const inputPath = path.join(folder, "input.txt");

  // Always write input file
  fs.writeFileSync(inputPath, input + "\n");

  const runCmd = `python3 ${folder}/main.py < ${folder}/input.txt`;

  console.log("Running Python with input:", input);

  return await runCommand(runCmd, "Runtime Error");
};

const executeJavaScript = async (folder) => {
  const runCmd = `node ${folder}/main.js < ${folder}/input.txt`;
  return await runCommand(runCmd, "Runtime Error");
};

const runCommand = (command, errorType) => {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 124 || error.killed) {
          return reject({ killed: true, message: "Time Limit Exceeded" });
        }
        return reject({
          stderr: stderr || error.message,
          status: errorType,
        });
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = {
  executeCode,
  // Keep old functions for backward compatibility
  compileCppCode: (folder) =>
    executeCode(
      folder,
      "cpp",
      fs.readFileSync(path.join(folder, "main.cpp"), "utf-8"),
    ),
  runCppCode: async (folder) => {
    // This is for run code button
    const input = fs.readFileSync(path.join(folder, "input.txt"), "utf-8");
    return executeCode(
      folder,
      "cpp",
      fs.readFileSync(path.join(folder, "main.cpp"), "utf-8"),
      input,
    );
  },
};
