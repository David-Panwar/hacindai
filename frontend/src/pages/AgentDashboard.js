import { useState } from "react";

export default function AgentDashboard() {

  const [logs, setLogs] = useState("");
  const [status, setStatus] = useState("");
  const [aiFix, setAiFix] = useState("");

  const getCIStatus = async () => {

  const res = await fetch("http://localhost:5000/ci-status");
  const data = await res.json();

  setStatus(`${data.status} - ${data.conclusion}`);
    console.log(status)
   
  return {
    runId: data.run_id,
    conclusion: data.conclusion 
     
  };
};

  const getLogs = async (runId) => {
    console.log(runId)
    const res = await fetch(`http://localhost:5000/ci-logs/${runId}`);
    const data = await res.text();

    setLogs(data);

    return data;
  };

  const sendToAI = async (logsData) => {

    const res = await fetch("http://localhost:5000/ai-fix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ logs: logsData })
    });

    const data = await res.json();

    setAiFix(data.fix);
  };

const runAgent = async () => {

  setLogs("⏳ Fetching CI logs...");
  setAiFix("⏳ Waiting for AI response...");

  const { runId, conclusion } = await getCIStatus();

  if (conclusion !== "failure") {
    setLogs("");
    setAiFix("✅ CI Passed. No fixes required.");
    return;
  }

  const logsData = await getLogs(runId);
  console.log("Run ID:", runId);

  await sendToAI(logsData);
};

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>

      <h1>🤖 AI DevOps Agent</h1>

      <button onClick={runAgent}>
        Fetch CI Logs & Send To AI
      </button>

      <h2>CI Status</h2>
      <pre>{status}</pre>

      <h2>CI Logs</h2>

      <div style={{
        background: "#111",
        color: "#0f0",
        padding: "20px",
        height: "300px",
        overflow: "scroll"
      }}>
        <pre>{logs}</pre>
      </div>

      <h2>AI Generated Fix</h2>

      <div style={{
        background: "#222",
        color: "#fff",
        padding: "20px"
      }}>
        <pre>{aiFix}</pre>
      </div>

    </div>
  );
}