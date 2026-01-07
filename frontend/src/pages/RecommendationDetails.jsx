import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link, useParams } from "react-router-dom";

function Card({ title, items }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
      <h2 className="font-bold text-white mb-3">{title}</h2>
      <div className="space-y-3">
        {items?.map((x, idx) => (
          <div key={x.itemId || idx} className="p-3 rounded-xl bg-slate-900/30 border border-white/5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-white">{x.title}</p>
              <span className="text-xs px-2 py-1 rounded-lg bg-black/30">{x.score}%</span>
            </div>
            <p className="text-white/60 text-xs mt-1">{x.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecommendationDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const res = await api.get(`/recommendations/${id}`);
        setDoc(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load");
      }
    })();
  }, [id]);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-white">Recommendation Details</h1>
            <div className="flex gap-2">
              <Link to="/history" className="btn-gradient">
                Back
              </Link>
              <Link to="/dashboard" className="btn-gradient">
                Dashboard
              </Link>
            </div>
          </div>

          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          {doc && (
            <>
              <div className="mb-6 p-5 rounded-2xl bg-slate-900/50 border border-white/10">
                <p className="text-white/80">
                  Snapshot: <span className="font-semibold text-white">{doc.profileSnapshot?.fullName || "—"}</span>
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Goal: {doc.profileSnapshot?.goal || "—"} • Major: {doc.profileSnapshot?.major || "—"} • Level:{" "}
                  {doc.profileSnapshot?.level || "—"} • Location: {doc.profileSnapshot?.location || "—"}
                </p>
                <p className="text-white/40 text-xs mt-2">Created: {new Date(doc.createdAt).toLocaleString()}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card title="Top Careers" items={doc.results?.careers} />
                <Card title="Top Formations" items={doc.results?.formations} />
                <Card title="Top PFE Topics" items={doc.results?.pfeTopics} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}