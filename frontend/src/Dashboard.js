import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [repo, setRepo] = useState("");
  const [team, setTeam] = useState("");
  const [leader, setLeader] = useState("");
  const [result, setResult] = useState({
    fixes: []
  });
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
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Autonomous DevOps Agent</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="GitHub Repo URL"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <input
          placeholder="Team Name"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <input
          placeholder="Leader Name"
          value={leader}
          onChange={(e) => setLeader(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <button onClick={runAgent} style={{ padding: "6px 12px" }}>
          Run Agent
        </button>
      </div>

      {loading && (
        <p>🤖 AI Agent is analyzing repository and fixing errors...</p>
      )}

      {!loading && result?.repository && (
        <div>
          <h2>Run Summary</h2>

          <p>
            <strong>Repository:</strong> {result.repository}
          </p>

          <p>
            <strong>Branch:</strong> {result.branch}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: result.status === "PASSED" ? "green" : "red",
                fontWeight: "bold"
              }}
            >
              {result.status}
            </span>
          </p>

          <h3>Fixes Applied</h3>

          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", marginTop: "10px" }}
          >
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
                        color: fix.status === "Fixed" ? "green" : "red"
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
  );
}