import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import PageShell from "../components/PageShell";

export default function MyProfile() {
  const [form, setForm] = useState({ fullName: "", goal: "", major: "", level: "", location: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const res = await api.get("/profile/me");
      setForm({
        fullName: res.data.fullName || "",
        goal: res.data.goal || "",
        major: res.data.major || "",
        level: res.data.level || "",
        location: res.data.location || "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load");
    }
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await api.put("/profile/me", form);
      setMsg("Saved ✅");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <PageShell
      title="My Profile"
      right={<Link className="btn-gradient" style={{ width: "auto" }} to="/dashboard">Back</Link>}
      max="max-w-xl"
    >
      <div className="card-glass">
        {err && <div style={{ marginBottom: 10, color: "#fecaca", fontWeight: 700 }}>{err}</div>}
        {msg && <div style={{ marginBottom: 10, color: "#bbf7d0", fontWeight: 800 }}>{msg}</div>}

        <form onSubmit={save} style={{ display: "grid", gap: 10 }}>
          <input className="input-ui" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="input-ui" placeholder="Goal (PFE / Job / Master…)" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          <input className="input-ui" placeholder="Major (BI / DS / Cyber…)" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />
          <input className="input-ui" placeholder="Level (e.g. 5ème année)" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <input className="input-ui" placeholder="Location (city)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <button className="btn-gradient">Save</button>
        </form>
      </div>
    </PageShell>
  );
}
