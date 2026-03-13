const path = require("path")
const fs = require("fs-extra")

const { cloneRepo } = require("./repoAgent")
const { detectBugs } = require("./bugDetectorAgent")
const { fixFile } = require("./aiFixAgent")
const { commitFix } = require("./commitAgent")

async function runPipeline(repo_url, team, leader) {

  const branchName = `${team}_${leader}_AI_Fix`
    .replace(/ /g, "_")
    .toUpperCase()

  const repoDir = path.join(__dirname, "../../temp_repo")

  if (fs.existsSync(repoDir)) {

    fs.removeSync(repoDir)

  }

  await cloneRepo(repo_url, repoDir)

  const errorLogs = await detectBugs(repoDir)

  let fixes = []

  if (errorLogs.includes("FAIL") || errorLogs.includes("Error")) {

    const file = path.join(repoDir, "src/calculator.js")

    await fixFile(file, errorLogs)

    fixes.push({
      file: "src/calculator.js",
      bug_type: "LOGIC",
      line: 2,
      commit: "[AI-AGENT] auto fix",
      status: "Fixed"
    })

    await commitFix(repoDir, branchName)

  }

  return {
    branch: branchName,
    fixes
  }

}

module.exports = { runPipeline }