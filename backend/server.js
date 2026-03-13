require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const AdmZip = require("adm-zip");

const agentRoutes = require("./routes/agentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", agentRoutes);

const token = process.env.GITHUB_TOKEN;

const owner = "David-Panwar";
const repo = "testRepo";

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json"
};



// ===============================
// GET CI STATUS
// ===============================
app.get("/ci-status", async (req, res) => {

  try {

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
      { headers }
    );

    const runs = response.data.workflow_runs;

    if (!runs.length) {
      return res.json({ message: "No CI runs found" });
    }

    const latestRun = runs[0];

    console.log("Latest CI Run:", latestRun.id);

    res.json({
      repo,
      branch: latestRun.head_branch,
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      run_id: latestRun.id
    });

  } catch (error) {

    console.error("CI STATUS ERROR:", error.message);

    res.status(500).json({
      error: "Failed to fetch CI status"
    });

  }

});



// ===============================
// GET CI LOGS
// ===============================
app.get("/ci-logs/:runId", async (req, res) => {

  try {

    const runId = req.params.runId;

    console.log("Fetching logs for run:", runId);

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/logs`,
      {
        headers,
        responseType: "arraybuffer"
      }
    );

    const zip = new AdmZip(response.data);

    const entries = zip.getEntries();

    if (!entries.length) {

      return res.json({
        message: "Logs not ready yet"
      });

    }

    let logs = "";

    entries.forEach(entry => {

      const content = entry.getData().toString("utf8");

      logs += `\n\n========== ${entry.entryName} ==========\n`;
      logs += content;

    });

    res.json({ logs });

  } catch (error) {

    console.error("CI LOG FETCH ERROR:", error.message);

    res.status(500).json({
      error: "Failed to fetch CI logs"
    });

  }

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});