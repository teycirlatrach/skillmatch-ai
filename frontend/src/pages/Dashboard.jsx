import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PageShell from "../components/PageShell";

export default function Dashboard() {
  const nav = useNavigate();
  const { logout, refreshAccess, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [rec, setRec] = useState(null);
  const [err, setErr] = useState("");

  async function loadProfile() {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load profile");
    }
  }

  async function generate() {
    setErr("");
    try {
      const res = await api.post("/recommendations/generate");
      setRec(res.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        await refreshAccess();
        const res = await api.post("/recommendations/generate");
        setRec(res.data);
        return;
      }
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const right = (
    <>
      {user?.role === "ADMIN" && (
        <Link className="btn-gradient" style={{ width: "auto" }} to="/admin">
          Admin Home
        </Link>
      )}

      <Link className="btn-gradient" style={{ width: "auto" }} to="/my-skills">
        My Skills
      </Link>

      <Link className="btn-gradient" style={{ width: "auto" }} to="/catalog/careers">
        Catalog
      </Link>

      <Link className="btn-gradient" style={{ width: "auto" }} to="/favorites">
        Favorites
      </Link>

      <Link className="btn-gradient" style={{ width: "auto" }} to="/history">
        History
      </Link>

      <button
        onClick={() => {
          logout();
          nav("/login");
        }}
        className="btn-gradient"
        style={{ width: "auto" }}
      >
        Logout
      </button>
    </>
  );

  return (
    <PageShell title="Dashboard" right={right}>
      {err && (
        <div style={{ marginBottom: 12 }} className="card-glass">
          <p style={{ color: "#fecaca", fontWeight: 700 }}>{err}</p>
        </div>
      )}

      <div className="card-glass">
        {profile ? (
          <>
            <p style={{ color: "rgba(255,255,255,.8)" }}>
              Welcome, <b>{profile.fullName}</b>
            </p>
            <p style={{ color: "rgba(255,255,255,.7)", marginTop: 6 }}>
              Goal: {profile.goal || "—"} • Major: {profile.major || "—"} • Level: {profile.level || "—"}
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 9, flexWrap: "wrap" }}>
              <button onClick={generate} className="btn-gradient" style={{ width: "auto" }}>
                Generate Recommendations
              </button>
            </div>
          </>
        ) : (
          <p style={{ color: "rgba(255,255,255,.7)" }}>Loading profile…</p>
        )}
      </div>

      {rec && (
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <Card title="Top Careers" items={rec.results?.careers} />
          <Card title="Top Formations" items={rec.results?.formations} />
          <Card title="Top PFE Topics" items={rec.results?.pfeTopics} />
        </div>
      )}
    </PageShell>
  );
}

function Card({ title, items }) {
  return (
    <div className="card-glass">
      <h2 style={{ fontWeight: 900 }}>{title}</h2>

      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {items?.length ? (
          items.map((x) => (
            <div key={x.itemId} className="card-soft">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>{x.title}</div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "rgba(0,0,0,.25)",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {x.score}%
                </span>
              </div>
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12, marginTop: 6 }}>{x.why}</div>
            </div>
          ))
        ) : (
          <p style={{ color: "rgba(255,255,255,.7)" }}>No results yet.</p>
        )}
      </div>
    </div>
  );
}
