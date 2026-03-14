import React, { useEffect, useState } from "react";

export default function CIDashboard() {

  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState("");

  useEffect(() => {

    const fetchStatus = async () => {
      try {
        const res = await fetch("https://hacindia.onrender.com/ci-status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await fetch("https://hacindia.onrender.com/ci-logs");
        const data = await res.text();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
    fetchLogs();

    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "monospace" }}>
      
      <h1>🤖 AI DevOps Agent Dashboard</h1>

      {status && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Repository</h3>
          <p>{status.repo}</p>

          <h3>Branch</h3>
          <p>{status.branch}</p>

          <h3>CI Status</h3>
          <p>{status.status}</p>
        </div>
      )}

      <div>
        <h3>CI Logs</h3>

        <div
          style={{
            background: "#111",
            color: "#0f0",
            padding: "20px",
            height: "300px",
            overflow: "auto",
            borderRadius: "10px"
          }}
        >
          <pre>{logs}</pre>
        </div>
      </div>

    </div>
  );
}