import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function CatalogCareers() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [favSet, setFavSet] = useState(new Set());

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const res = await api.get("/catalog/careers");
        setRows(res.data);

        const fav = await api.get("/favorites");
        setFavSet(new Set(fav.data.map((x) => `${x.kind}:${x.itemId}`)));
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load careers");
      }
    })();
  }, []);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-white">Careers Catalog</h1>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn-gradient">
                Back
              </Link>
              <Link to="/catalog/formations" className="btn-gradient">
                Formations
              </Link>
              <Link to="/catalog/pfe" className="btn-gradient">
                PFE
              </Link>
            </div>
          </div>

          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {rows.map((c) => {
              const key = `CAREER:${c._id}`;
              const already = favSet.has(key);

              return (
                <div key={c._id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
                  <p className="font-bold text-white">{c.title}</p>
                  <p className="text-sm text-white/40 mt-1">{c.domain || "—"}</p>
                  <p className="text-sm text-white/60 mt-3">{c.description || "No description"}</p>

                  <button
                    disabled={already}
                    onClick={async () => {
                      await api.post("/favorites", { kind: "CAREER", itemId: c._id, title: c.title });
                      setFavSet((prev) => new Set(prev).add(key));
                    }}
                    className={`mt-4 px-4 py-2 rounded-xl font-semibold transition-colors ${
                      already
                        ? "bg-slate-800/50 opacity-60 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-500"
                    }`}
                  >
                    {already ? "⭐ Added to Favorites" : "⭐ Add to Favorites"}
                  </button>
                </div>
              );
            })}
          </div>

          {rows.length === 0 && !err && (
            <p className="text-white/60 py-6 text-center">No careers found.</p>
          )}
        </div>
      </div>
    </div>
  );
}