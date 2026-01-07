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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">PFE Topics Catalog</h1>
          <div className="flex gap-2">
            <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">Back</Link>
            <Link to="/catalog/careers" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">Careers</Link>
            <Link to="/catalog/formations" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">Formations</Link>
          </div>
        </div>

        {err && <div className="mt-4 p-3 rounded-xl bg-red-950 border border-red-900 text-red-200">{err}</div>}

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {rows.map((t) => {
            const key = `PFE:${t._id}`;
            const already = favSet.has(key);

            return (
              <div key={t._id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="font-bold">{t.title}</p>
                <p className="text-sm text-slate-400 mt-1">
                  Career: {t.careerId?.title || "—"}
                </p>
                <p className="text-sm text-slate-300 mt-3">{t.description || "No description"}</p>

                <button
                  disabled={already}
                  onClick={async () => {
                    await api.post("/favorites", { kind: "PFE", itemId: t._id, title: t.title });
                    setFavSet((prev) => new Set(prev).add(key));
                  }}
                  className={
                    "mt-4 px-4 py-2 rounded-xl font-semibold " +
                    (already ? "bg-slate-800 opacity-60 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500")
                  }
                >
                  {already ? "⭐ Added" : "⭐ Add to Favorites"}
                </button>
              </div>
            );
          })}
        </div>

        {rows.length === 0 && !err && <p className="mt-6 text-slate-400">No PFE topics found.</p>}
      </div>
    </div>
  );
}
