import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function CatalogPfe() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [favSet, setFavSet] = useState(new Set());

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const res = await api.get("/catalog/pfe");
        setRows(res.data);

        const fav = await api.get("/favorites");
        setFavSet(new Set(fav.data.map((x) => `${x.kind}:${x.itemId}`)));
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load PFE topics");
      }
    })();
  }, []);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-white">PFE Topics Catalog</h1>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn-gradient">
                Back
              </Link>
              <Link to="/catalog/careers" className="btn-gradient">
                Careers
              </Link>
              <Link to="/catalog/formations" className="btn-gradient">
                Formations
              </Link>
            </div>
          </div>

          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {rows.map((t) => {
              const key = `PFE:${t._id}`;
              const already = favSet.has(key);

              return (
                <div key={t._id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
                  <p className="font-bold text-white">{t.title}</p>
                  <p className="text-sm text-white/40 mt-1">
                    Career: {t.careerId?.title || "—"}
                  </p>
                  <p className="text-sm text-white/60 mt-3">{t.description || "No description"}</p>

                  <button
                    disabled={already}
                    onClick={async () => {
                      await api.post("/favorites", { kind: "PFE", itemId: t._id, title: t.title });
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
            <p className="text-white/60 py-6 text-center">No PFE topics found.</p>
          )}
        </div>
      </div>
    </div>
  );
}