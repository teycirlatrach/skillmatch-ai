import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AdminHome() {
  const [stats, setStats] = useState({ studentsCount: 0, recommendationsCount: 0 });
  const [err, setErr] = useState("");

  async function loadStats() {
    setErr("");
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load stats");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin — Control Panel</h1>
            <p className="text-white/60">Manage the platform and view statistics</p>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <StatCard
              title="Students"
              value={stats.studentsCount}
              desc="Total number of student accounts"
            />
            <StatCard
              title="Recommendations"
              value={stats.recommendationsCount}
              desc="Total recommendations generated"
            />
          </div>

          {err && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          {/* MENU - Gardé exactement comme l'original mais adapté */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Skills" desc="Create / update skills list">
              <Link className="btn" to="/admin/skills">Open Skills</Link>
            </Card>

            <Card title="Careers" desc="Create careers + required skills">
              <Link className="btn" to="/admin/careers">Open Careers</Link>
            </Card>

            <Card title="Formations" desc="Create formations + linked skills">
              <Link className="btn" to="/admin/formations">Open Formations</Link>
            </Card>

            <Card title="PFE Topics" desc="Add PFE topics linked to careers">
              <Link className="btn" to="/admin/pfe">Open PFE</Link>
            </Card>
          </div>

          <style>{`
            .btn{
              display:inline-block;
              padding:12px 16px;
              border-radius:14px;
              background:#1f2937;
              border:1px solid #334155;
              color: white;
              text-decoration: none;
              font-weight: 600;
              transition: background-color 0.2s;
            }
            .btn:hover{ 
              background:#334155;
              color: white;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
      <p className="text-white/60 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      <p className="text-white/40 text-sm mt-2">{desc}</p>
    </div>
  );
}

function Card({ title, desc, children }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
      <p className="font-bold text-lg text-white">{title}</p>
      <p className="text-sm text-white/60 mt-1">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}