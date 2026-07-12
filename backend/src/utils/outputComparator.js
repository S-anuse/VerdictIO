const compareOutput = (actualOutput, expectedOutput) => {
  actualOutput = actualOutput.trim();
  expectedOutput = expectedOutput.trim();
  return actualOutput === expectedOutput;
};
module.exports = { compareOutput };
