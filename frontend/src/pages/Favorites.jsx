import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

const TABS = [
  { key: "CAREER", label: "Careers" },
  { key: "FORMATION", label: "Formations" },
  { key: "PFE", label: "PFE" },
];

export default function Favorites() {
  const [tab, setTab] = useState("CAREER");
  const [all, setAll] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/favorites");
      setAll(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  async function remove(kind, itemId) {
    try {
      await api.delete(`/favorites?kind=${encodeURIComponent(kind)}&itemId=${encodeURIComponent(itemId)}`);
      setAll((prev) => prev.filter((x) => !(x.kind === kind && x.itemId === itemId)));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to remove");
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => all.filter((x) => x.kind === tab), [all, tab]);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-white">⭐ Favorites</h1>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn-gradient">
                Back
              </Link>
              <Link to="/catalog/careers" className="btn-gradient">
                Catalog
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  tab === t.key
                    ? "bg-indigo-600 border-indigo-500 font-semibold"
                    : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && <p className="text-white/60 py-4">Loading...</p>}
          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          {/* List */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((x) => (
              <div key={x._id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
                <p className="font-bold text-white">{x.title || "Untitled"}</p>
                <p className="text-sm text-white/40 mt-1">
                  Type: {x.kind} • Added: {new Date(x.createdAt).toLocaleString()}
                </p>

                <button
                  onClick={() => remove(x.kind, x.itemId)}
                  className="mt-4 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {!loading && !err && filtered.length === 0 && (
            <p className="text-white/60 py-6 text-center">No favorites in this tab yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}