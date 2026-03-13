const { exec } = require("child_process");

function runTests(repoDir) {

  return new Promise((resolve) => {

    console.log("Installing dependencies...");

    exec("npm install", { cwd: repoDir }, (err, stdout, stderr) => {

      console.log("Dependencies installed");

      console.log("Running tests...");

      exec("npm test", { cwd: repoDir }, (err2, stdout2, stderr2) => {

        const output = stdout2 + stderr2;

        console.log("Test finished");

        resolve(output);

      });

    });

  });

}

module.exports = { runTests };