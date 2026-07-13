const { exec } = require("child_process");

const compileCppCode = async (submissionFolderPath) => {
  const command = `docker run --rm -v "${submissionFolderPath}:/app" cpp-runner bash -c "rm -f /app/main && g++ /app/main.cpp -o /app/main"`;
  console.log("compiling...");
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("Compilation Error:");
        console.log(error);
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        return reject(error);
      }
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      resolve(stdout);
    });
  });
};

const runCppCode = async (submissionFolderPath) => {
  const command = `docker run --rm -v "${submissionFolderPath}:/app" cpp-runner bash -c "/app/main < /app/input.txt"`;
  console.log("running...");
  console.log(command);
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 2000 }, (error, stdout, stderr) => {
      if (error) {
        console.log("Error:", error);
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        return reject(error);
      }
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  compileCppCode,
  runCppCode,
};
