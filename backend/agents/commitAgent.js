require("dotenv").config();
const simpleGit = require("simple-git");

async function commitFix(repoDir, branchName) {
  try {

    const git = simpleGit(repoDir);

    const username = "David-Panwar";
    const token = "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";
    console.log(username + token);

    const authRepoUrl =
      `https://${username}:${token}@github.com/${username}/testRepo.git`;

    console.log("Setting authenticated remote...");
    await git.remote(["set-url", "origin", authRepoUrl]);

    console.log("Creating branch:", branchName);

    const branches = await git.branch();

    if (!branches.all.includes(branchName)) {
      await git.checkoutLocalBranch(branchName);
    } else {
      await git.checkout(branchName);
    }

    console.log("Adding files...");
    await git.add(".");

    const status = await git.status();

    if (status.files.length === 0) {
      console.log("No changes to commit");
      return { branch: branchName, status: "No changes" };
    }

    console.log("Committing fixes...");
    await git.commit("[AI-AGENT] Fix: automated bug fix");

    console.log("Pushing branch...");
    await git.push("origin", branchName);

    return { branch: branchName, status: "Pushed" };

  } catch (error) {

    console.error("Commit agent error:", error);

    return {
      branch: branchName,
      status: "Failed",
      error: error.message
    };

  }
}

module.exports = { commitFix };