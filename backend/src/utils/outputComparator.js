const compareOutput = (actualOutput, expectedOutput) => {
  const normalize = (str) => {
    return str.trim().replace(/\s+/g, " ").trim();
  };

  const normalizedActual = normalize(actualOutput);
  const normalizedExpected = normalize(expectedOutput);

  return normalizedActual === normalizedExpected;
};

module.exports = { compareOutput };
