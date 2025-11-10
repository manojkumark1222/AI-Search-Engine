import React from "react";
import { Link } from "react-router-dom";

function StatCard({ title, value }) {
  return (
    <div className="card">
      <div style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontWeight: 700, fontSize: 20 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 220, padding: 16, borderRight: "1px solid #eee", background: "#fff", minHeight: "100vh" }}>
        <h3 style={{ marginTop: 0 }}>AI Insight Hub</h3>
        <nav style={{ marginTop: 20 }}>
          <div><Link to="/dashboard">Dashboard</Link></div>
          <div style={{ marginTop: 8 }}><Link to="/connections">Connections</Link></div>
          <div style={{ marginTop: 8 }}><Link to="/chat">Query</Link></div>
        </nav>
      </div>

      <div style={{ flex: 1, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Welcome back 👋</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16 }}>
          <StatCard title="Queries Today" value="12" />
          <StatCard title="Active Connections" value="3" />
          <StatCard title="Success Rate" value="90%" />
          <StatCard title="Avg Response Time" value="16ms" />
        </div>

        <div style={{ marginTop: 24 }}>
          <Link to="/chat"><button style={{ padding: "10px 16px" }}>Start a Query</button></Link>
        </div>
      </div>
    </div>
  );
}
