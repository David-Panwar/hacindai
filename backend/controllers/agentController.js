// const simpleGit = require("simple-git");
// const { runTests } = require("../agents/testAgent");
// const { detectBugs } = require("../agents/bugDetectorAgent");
// const { fixCode } = require("../agents/aiFixAgent");
// const { commitFix } = require("../agents/commitAgent");
// const fs = require("fs-extra");
// const path = require("path");

// const git = simpleGit();

// const runAgent = async (req, res) => {
//   try {

//     const { repo_url, team_name, leader_name } = req.body;

//     if (!repo_url) {
//       return res.status(400).json({ error: "Repository URL required" });
//     }

//     const baseDir = path.join(__dirname, "../cloned");

//     await fs.ensureDir(baseDir);

//     const repoName = repo_url.split("/").pop().replace(".git", "");

//     const folderName = `${repoName}_${Date.now()}`;

//     const repoDir = path.join(baseDir, folderName);

//     console.log("Creating folder:", repoDir);

//     await fs.ensureDir(repoDir);

//     console.log("Cloning repository...");

//     const token = process.env.GITHUB_TOKEN;

// // inject token into URL
// const authRepoUrl = repo_url.replace(
//   "https://",
//   `https://${token}@`
// );

// await git.clone(authRepoUrl, repoDir);

//     console.log("Repository cloned successfully");

//     const branchName = `${team_name}_${leader_name}_AI_Fix`
//       .replace(/ /g, "_")
//       .toUpperCase();

//     // 🔹 RUN TESTS
//     const testOutput = await runTests(repoDir);

//     console.log("Test Output:", testOutput);

//     // 🔹 DETECT BUGS
//     const bugs = detectBugs(testOutput);

//     console.log("Detected Bugs:", bugs);

//     // 🔹 AI FIX
//     const fixes = await fixCode(repoDir, bugs);

//     console.log("Applied Fixes:", fixes);

//     const commitResult = await commitFix(repoDir, branchName);

// console.log("Commit Result:", commitResult);

//     // 🔹 FINAL RESPONSE
//    res.json({
//   message: "Repository analyzed and fixed",
//   repo_folder: folderName,
//   repo_path: repoDir,
//   branch: branchName,
//   test_output: testOutput,
//   detected_bugs: bugs,
//   applied_fixes: fixes,
//   commit: commitResult
// });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       error: "Agent failed to process repository"
//     });

//   }
// };


// module.exports = runAgent;




// controllers/agentController.js
const simpleGit = require("simple-git");
const { runTests } = require("../agents/testAgent");
const { detectBugs } = require("../agents/bugDetectorAgent");
const { fixCode } = require("../agents/aiFixAgent");
const { commitFix } = require("../agents/commitAgent");
const fs = require("fs-extra");
const path = require("path");

const runAgent = async (req, res) => {
  let repoDir = null;

  try {
    const { repo_url, team_name, leader_name } = req.body;

    if (!repo_url) {
      return res.status(400).json({ error: "Repository URL required" });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "GITHUB_TOKEN not configured" });
    }

    // ── Setup directories ──────────────────────────────────────────
    const baseDir = path.join(__dirname, "../cloned");
    await fs.ensureDir(baseDir);

    const repoName = repo_url.split("/").pop().replace(".git", "");
    const folderName = `${repoName}_${Date.now()}`;
    repoDir = path.join(baseDir, folderName);
    await fs.ensureDir(repoDir);

    // ── Build auth URL: https://username:token@github.com/... ──────
    // Extracts "David-Panwar" from the URL automatically
    const urlObj = new URL(repo_url);
    const username = urlObj.pathname.split("/")[1]; // repo owner
    const authRepoUrl = `https://${username}:${token}@${urlObj.host}${urlObj.pathname}`;

    console.log("Cloning repository...");
    await simpleGit().clone(authRepoUrl, repoDir);
    console.log("Repository cloned successfully");

    // ── Configure git identity in the cloned repo ──────────────────
    const repoGit = simpleGit(repoDir);
    await repoGit.addConfig("user.email", "ai-agent@cicd.bot");
    await repoGit.addConfig("user.name", "AI Fix Agent");

    // ✅ CRITICAL: Set authenticated remote so commitAgent can push
    await repoGit.remote([
      "set-url",
      "origin",
      authRepoUrl,
    ]);

    // ── Branch name ────────────────────────────────────────────────
    const branchName = `${team_name}_${leader_name}_AI_Fix`
      .replace(/ /g, "_")
      .toUpperCase();

    // ── Pipeline ───────────────────────────────────────────────────
    console.log("Running tests...");
    const testOutput = await runTests(repoDir);
    console.log("Test Output:", testOutput);

    console.log("Detecting bugs...");
    const bugs = detectBugs(testOutput);
    console.log("Detected Bugs:", bugs);

    console.log("Applying AI fixes...");
    const fixes = await fixCode(repoDir, bugs);
    console.log("Applied Fixes:", fixes);

    console.log("Committing and pushing...");
    // Pass repoDir so commitAgent uses the RIGHT git instance
    const commitResult = await commitFix(repoDir, branchName);
    console.log("Commit Result:", commitResult);

    res.json({
      message: "Repository analyzed and fixed",
      repo_folder: folderName,
      repo_path: repoDir,
      branch: branchName,
      test_output: testOutput,
      detected_bugs: bugs,
      applied_fixes: fixes,
      commit: commitResult,
    });

  } catch (error) {
    console.error("Agent error:", error.message);
    res.status(500).json({
      error: "Agent failed to process repository",
      details: error.message,
    });
  }
};

module.exports = runAgent;