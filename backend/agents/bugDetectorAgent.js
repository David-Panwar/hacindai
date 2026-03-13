function detectBugs(testOutput) {

  const bugs = [];

  // Detect test failures
  if (testOutput.includes("FAIL")) {

    bugs.push({
      bug_type: "LOGIC",
      message: "Test failure detected",
      status: "Detected"
    });

  }

  // Detect syntax errors
  if (testOutput.includes("SyntaxError")) {

    bugs.push({
      bug_type: "SYNTAX",
      message: "Syntax error detected",
      status: "Detected"
    });

  }

  // Detect import/module errors
  if (testOutput.includes("Cannot find module")) {

    bugs.push({
      bug_type: "IMPORT",
      message: "Missing module detected",
      status: "Detected"
    });

  }

  // Detect lint errors
  if (testOutput.includes("eslint")) {

    bugs.push({
      bug_type: "LINTING",
      message: "Linting error detected",
      status: "Detected"
    });

  }

  return bugs;
}

module.exports = { detectBugs };