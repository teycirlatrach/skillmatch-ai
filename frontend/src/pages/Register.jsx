import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import PageShell from "../components/PageShell";

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/register", { fullName, email, password, role });
      nav("/login");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Create account" max="max-w-xl" right={<Link className="btn-gradient" style={{ width: "auto" }} to="/login">Login</Link>}>
      <div className="card-glass">
        {err && <div style={{ marginBottom: 10, color: "#fecaca", fontWeight: 700 }}>{err}</div>}

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input className="input-ui" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="input-ui" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input-ui" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <select className="input-ui" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button disabled={loading} className="btn-gradient">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 10, color: "rgba(255,255,255,.75)" }}>
          Already have account? <Link to="/login" style={{ color: "var(--c-sky)", fontWeight: 800 }}>Login</Link>
        </p>
      </div>
    </PageShell>
  );
}
