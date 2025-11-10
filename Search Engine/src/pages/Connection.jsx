import React , { useState, useEffect } from "react";
import api from "../services/api";

export default function Connections() {
  const [name, setName] = useState("");
  const [type, setType] = useState("csv");
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await api.get("/connections");
      setList(res.data.connections || []);
    } catch (e) {
      alert("Failed to fetch connections: " + (e.response?.data?.detail || e.message));
    }
  };

  useEffect(() => { fetchList(); }, []);

  const add = async () => {
    try {
      await api.post("/connections/add", { name, type, details: {} });
      setName("");
      fetchList();
    } catch (e) {
      alert("Add connection failed: " + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <div className="container">
      <h2>Connections</h2>
      <div style={{ marginTop: 12 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
          <option value="postgres">Postgres</option>
          <option value="mysql">MySQL</option>
          <option value="mongodb">MongoDB</option>
        </select>
        <button onClick={add} style={{ marginLeft: 8 }}>Add</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>Existing</h4>
        <ul>{list.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>
    </div>
  );
}
