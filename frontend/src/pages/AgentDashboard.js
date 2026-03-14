import { useState } from "react";

export default function AgentDashboard() {

  const [logs, setLogs] = useState("");
  const [status, setStatus] = useState("");
  const [aiFix, setAiFix] = useState("");

  const getCIStatus = async () => {

    const res = await fetch("http://localhost:5000/ci-status");
    const data = await res.json();

    setStatus(`${data.status} - ${data.conclusion}`);

    return {
      runId: data.run_id,
      conclusion: data.conclusion
    };
  };

  const getLogs = async (runId) => {

    const res = await fetch(`http://localhost:5000/ci-logs/${runId}`);
    const data = await res.text();

    setLogs(data);
    return data;
  };

  const sendToAI = async (logsData) => {

    const res = await fetch("http://localhost:5000/9ai-fix", {
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

    setLogs("");
    setAiFix("");

    const { runId, conclusion } = await getCIStatus();

    if (conclusion !== "failure") {
      setLogs("");
      setAiFix("✅ CI Passed. No fixes required.");
      return;
    }

    const logsData = await getLogs(runId);
    await sendToAI(logsData);
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>🤖 AI DevOps Agent</h1>
        <p style={styles.subtitle}>
          Autonomous system that analyzes CI failures and generates fixes
        </p>

        <button style={styles.button} onClick={runAgent}>
          Run AI Agent 🚀
        </button>

        <div style={styles.section}>
          <h2>CI Status</h2>
          <div style={styles.statusBox}>
            <pre>{status || ""}</pre>
          </div>
        </div>

        <div style={styles.section}>
          <h2>CI Logs</h2>

          <div style={styles.terminal}>
            <pre>{logs || ""}</pre>
          </div>
        </div>

        <div style={styles.section}>
          <h2>AI Generated Fix</h2>

          {/* <div style={styles.aiBox}>
            <pre>{aiFix || ""}</pre>
          </div> */}
        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#141e30,#243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace"
  },

  card: {
    width: "900px",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    color: "white"
  },

  title: {
    fontSize: "32px",
    marginBottom: "5px"
  },

  subtitle: {
    opacity: 0.8,
    marginBottom: "20px"
  },

  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(45deg,#00c6ff,#0072ff)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "25px"
  },

  section: {
    marginTop: "20px"
  },

  statusBox: {
    background: "#1e1e1e",
    padding: "15px",
    borderRadius: "8px"
  },

  terminal: {
    background: "#000",
    color: "#00ff9c",
    padding: "20px",
    height: "260px",
    overflow: "auto",
    borderRadius: "8px",
    fontSize: "13px",
    boxShadow: "inset 0 0 10px #00ff9c"
  },

  aiBox: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    borderLeft: "4px solid #00c6ff"
  }

};