const fs = require("fs");
const path = require("path");

const createSubmissionFile = async (
  submissionId,
  sourceCode,
  language = "cpp",
) => {
  const folderPath = path.join(
    __dirname,
    "../../temp",
    `submission-${submissionId}`,
  );
  await fs.promises.mkdir(folderPath, { recursive: true });

  const fileName =
    language.toLowerCase() === "python"
      ? "main.py"
      : language.toLowerCase() === "javascript"
        ? "main.js"
        : language.toLowerCase() === "java"
          ? "Main.java"
          : "main.cpp";

  const filePath = path.join(folderPath, fileName);
  await fs.promises.writeFile(filePath, sourceCode);

  return folderPath;
};

const createInputFile = async (folderPath, input) => {
  const inputFilePath = path.join(folderPath, "input.txt");
  await fs.promises.writeFile(inputFilePath, input);
};

const deleteSubmissionFolder = async (folderPath) => {
  await fs.promises.rm(folderPath, {
    recursive: true,
    force: true,
  });
};

module.exports = {
  createSubmissionFile,
  createInputFile,
  deleteSubmissionFolder,
};
