import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [repo, setRepo] = useState("");
  const [team, setTeam] = useState("");
  const [leader, setLeader] = useState("");
  const [result, setResult] = useState({ fixes: [] });
  const [loading, setLoading] = useState(false);

  const runAgent = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/run-agent", {
        repo_url: repo,
        team_name: team,
        leader_name: leader
      });

      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to run agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>🤖 Autonomous DevOps Agent</h1>
        <p style={styles.subtitle}>
          AI-powered system that analyzes repositories and automatically fixes bugs
        </p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="GitHub Repository URL"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Team Name"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Leader Name"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
          />

          <button style={styles.button} onClick={runAgent}>
            Run AI Agent 🚀
          </button>
        </div>

        {loading && (
          <div style={styles.loading}>
            ⚡ AI Agent is analyzing repository and fixing bugs...
          </div>
        )}

        {!loading && result?.repository && (
          <div style={styles.results}>

            <h2>Run Summary</h2>

            <div style={styles.summary}>
              <p><strong>Repository:</strong> {result.repository}</p>
              <p><strong>Branch:</strong> {result.branch}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: result.status === "PASSED" ? "#00ff88" : "#ff4d4d",
                    fontWeight: "bold"
                  }}
                >
                  {result.status}
                </span>
              </p>
            </div>

            <h3>Fixes Applied</h3>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Bug Type</th>
                  <th>Line</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {result?.fixes?.length > 0 ? (
                  result.fixes.map((fix, i) => (
                    <tr key={i}>
                      <td>{fix.file}</td>
                      <td>{fix.bug_type}</td>
                      <td>{fix.line}</td>
                      <td
                        style={{
                          color: fix.status === "Fixed" ? "#00ff88" : "#ff4d4d"
                        }}
                      >
                        {fix.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No fixes detected</td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },

  card: {
    width: "900px",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    color: "white"
  },

  title: {
    fontSize: "32px",
    marginBottom: "5px"
  },

  subtitle: {
    opacity: 0.8,
    marginBottom: "25px"
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  input: {
    flex: "1",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(45deg,#00c6ff,#0072ff)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  loading: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#00e5ff"
  },

  results: {
    marginTop: "30px"
  },

  summary: {
    marginBottom: "15px",
    lineHeight: "1.8"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    background: "rgba(255,255,255,0.05)"
  }
};