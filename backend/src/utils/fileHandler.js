const fs = require("fs");
const path = require("path");

const createSubmissionFile = async (submissionId, sourceCode) => {
  const folderPath = path.join(
    __dirname,
    "../../temp",
    `submission-${submissionId}`,
  );
  await fs.promises.mkdir(folderPath, { recursive: true });
  const filePath = path.join(folderPath, "main.cpp");
  await fs.promises.writeFile(filePath, sourceCode);
  return folderPath;
};

const createInputFile = async (folderPath, input) => {
  const inputFilePath = path.join(folderPath, "input.txt");
  await fs.promises.writeFile(inputFilePath, input);
};
module.exports = { createSubmissionFile, createInputFile };
