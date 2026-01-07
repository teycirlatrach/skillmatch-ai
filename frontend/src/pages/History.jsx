import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function History() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const res = await api.get("/recommendations/history");
      setList(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load history");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-white">Recommendation History</h1>
            <Link to="/dashboard" className="btn-gradient">
              Back
            </Link>
          </div>

          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          <div className="space-y-4">
            {list.map((r) => (
              <div key={r._id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <p className="font-semibold text-white">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-white/40">
                    Goal: {r.goal || "—"} • Major: {r.major || "—"} • Level: {r.level || "—"}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Mini title="Top Careers" items={r.results?.careers} />
                  <Mini title="Top Formations" items={r.results?.formations} />
                  <Mini title="Top PFE Topics" items={r.results?.pfeTopics} />
                </div>
              </div>
            ))}

            {list.length === 0 && (
              <p className="text-white/60 py-6 text-center">
                No history yet. Generate recommendations first.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ title, items }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/30 border border-white/5">
      <p className="font-bold text-sm text-white mb-3">{title}</p>
      <div className="space-y-2">
        {(items || []).slice(0, 3).map((x) => (
          <div key={x.itemId} className="flex items-center justify-between gap-2">
            <p className="text-xs text-white/80 truncate">{x.title}</p>
            <span className="text-xs px-2 py-1 rounded-lg bg-black/30">{x.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}