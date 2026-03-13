const simpleGit = require("simple-git")

const git = simpleGit()

async function cloneRepo(repo_url, dir) {

  await git.clone(repo_url, dir)

}

module.exports = { cloneRepo }