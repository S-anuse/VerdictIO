const { exec } = require("child_process");

async function executeCppCode(submissionFolderPath) {
  const command = `docker run --rm -v "${submissionFolderPath}:/app" cpp-runner bash -c "g++ /app/main.cpp -o /app/main && /app/main"`;
  console.log("Docker command:");
  console.log(command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      resolve(stdout);
    });
  });
}

module.exports = {
  executeCppCode,
};
