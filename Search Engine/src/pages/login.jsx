import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        nav("/dashboard");
      }
    } catch (e) {
      alert("Login failed: " + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ width: 360, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", background: "#fff", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <input placeholder="Email" style={{ width: "100%", padding: 8, margin: "8px 0" }} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" style={{ width: "100%", padding: 8, margin: "8px 0" }} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>Login</button>
      </div>
    </div>
  );
}
