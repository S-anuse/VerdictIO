const { exec } = require("child_process");

const compileCppCode = async (submissionFolderPath) => {
  const command = `g++ ${submissionFolderPath}/main.cpp -o ${submissionFolderPath}/main`;
  console.log("Compiling C++...");

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Compilation Error:", stderr);
        return reject({
          stderr: stderr || error.message,
          status: "Compilation Error",
        });
      }
      console.log("C++ Compilation Successful");
      resolve(stdout);
    });
  });
};

const runCppCode = async (submissionFolderPath) => {
  const command = `${submissionFolderPath}/main < ${submissionFolderPath}/input.txt`;
  console.log("Running C++ code...");

  return new Promise((resolve, reject) => {
    exec(command, { timeout: 2000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 124 || error.killed) {
          return reject({ killed: true, message: "Time Limit Exceeded" });
        }
        console.error("Runtime Error:", stderr || error.message);
        return reject({
          stderr: stderr || error.message,
          status: "Runtime Error",
        });
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  compileCppCode,
  runCppCode,
};
