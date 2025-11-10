import React, { useState } from "react";
import api from "../service/api";

export default function QueryChat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleQuery = async () => {
    try {
      const res = await api.post("/query/run", { query_text: query, source_id: "default" });
      setResponse(res.data);
      // optionally log history:
      await api.post("/history/log", undefined, { params: { query } });
    } catch (e) {
      alert("Query failed: " + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <div className="container">
      <h2>Ask about your data</h2>
      <div style={{ marginTop: 8 }}>
        <input placeholder="e.g., Show top 5 students by marks" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: "60%", padding: 8 }} />
        <button onClick={handleQuery} style={{ marginLeft: 8, padding: 8 }}>Search</button>
      </div>

      {response && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700 }}>{response.summary}</div>

          <div style={{ marginTop: 8 }}>
            {response.suggestions?.map((s, i) => (
              <button key={i} onClick={() => alert("Suggestion clicked: " + s)} style={{ marginRight: 8, padding: "6px 10px" }}>
                {s}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Results (sample)</h4>
            <table style={{ borderCollapse: "collapse", width: "60%" }}>
              <thead>
                <tr>
                  {response.results?.length > 0 && Object.keys(response.results[0]).map((k) => (
                    <th key={k} style={{ border: "1px solid #ddd", padding: 6 }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {response.results?.map((r, idx) => (
                  <tr key={idx}>
                    {Object.values(r).map((v, i) => <td key={i} style={{ border: "1px solid #eee", padding: 6 }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
