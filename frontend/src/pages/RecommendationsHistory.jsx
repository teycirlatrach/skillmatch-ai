import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function RecommendationsHistory() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const res = await api.get("/recommendations/history");
        setRows(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load history");
      }
    })();
  }, []);

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

          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r._id} className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Goal: {r.goal}</p>
                  <p className="text-sm text-white/40">
                    {new Date(r.createdAt).toLocaleString()} • Top Career: {r.topCareer} ({r.topScore}%)
                  </p>
                </div>

                <Link
                  to={`/recommendations/${r._id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {rows.length === 0 && !err && (
            <p className="text-white/60 py-6 text-center">
              No history yet. Generate recommendations first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}