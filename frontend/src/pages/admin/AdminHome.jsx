import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";


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
    <AdminLayout title="Admin — Control Panel">
      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
        <div className="mb-4 p-3 rounded-xl bg-red-950 border border-red-900 text-red-200">
          {err}
        </div>
      )}

      {/* MENU */}
      <div className="grid md:grid-cols-2 gap-4">
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
        }
        .btn:hover{ background:#334155; }
      `}</style>
    </AdminLayout>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-slate-400 text-sm mt-2">{desc}</p>
    </div>
  );
}

function Card({ title, desc, children }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
      <p className="font-bold text-lg">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
