require("dotenv").config();
const { Octokit } = require("@octokit/rest");

async function createPullRequest(branchName) {

  try {

    const username = "David-Panwar";
    const token = "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" ;

    const octokit = new Octokit({
      auth: token,
    });

    console.log("Creating Pull Request...");

    const response = await octokit.pulls.create({

      owner: username,
      repo: "testRepo",

      title: `[AI-AGENT] Fix from ${branchName}`,

      body:
        "This pull request was automatically created by the AI Agent after applying fixes.",

      head: branchName,
      base: "main"

    });

    console.log("Pull Request Created:");
    console.log(response.data.html_url);

    return {

      branch: branchName,
      status: "PR Created",
      prUrl: response.data.html_url

    };

  } catch (error) {

    console.error("PR agent error:", error);

    return {

      branch: branchName,
      status: "Failed",
      error: error.message

    };

  }

}

module.exports = { createPullRequest };