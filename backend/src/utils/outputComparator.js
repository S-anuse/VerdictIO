const compareOutput = (actualOutput, expectedOutput) => {
  const normalize = (str) => {
    if (str === null || str === undefined) return "";
    return str.toString().trim().replace(/\s+/g, " ").trim();
  };

  const normalizedActual = normalize(actualOutput);
  const normalizedExpected = normalize(expectedOutput);

  return normalizedActual === normalizedExpected;
};

module.exports = { compareOutput };
