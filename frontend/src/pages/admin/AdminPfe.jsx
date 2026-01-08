import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function AdminPfe() {
  const [items, setItems] = useState([]);
  const [careers, setCareers] = useState([]);

  const [title, setTitle] = useState("");
  const [careerId, setCareerId] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [suggestedStack, setSuggestedStack] = useState("MERN,JWT,Tailwind");
  const [description, setDescription] = useState("");

  const [err, setErr] = useState("");

  async function load() {
    const [pRes, cRes] = await Promise.all([
      api.get("/pfe-topics"),
      api.get("/careers"),
    ]);
    setItems(pRes.data);
    setCareers(cRes.data);
    if (!careerId && cRes.data.length) setCareerId(cRes.data[0]._id);
  }

  async function add(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/pfe-topics", {
        title,
        careerId,
        difficulty,
        suggestedStack: suggestedStack.split(",").map(s => s.trim()).filter(Boolean),
        description,
      });
      setTitle(""); setDifficulty("Medium"); setSuggestedStack("MERN,JWT,Tailwind"); setDescription("");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create PFE topic");
    }
  }

  async function del(id) {
    if (!confirm("Delete this PFE topic?")) return;
    await api.delete(`/pfe-topics/${id}`);
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          {/* HEADER WITH BACK BUTTON */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin — PFE Topics</h1>
              <p className="text-white/60 mt-1">Create and manage PFE topics linked to careers</p>
            </div>
            <Link to="/admin" className="btn-gradient">
              ← Back to Admin
            </Link>
          </div>

          {err && (
            <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
              <h2 className="font-bold text-white mb-3">Create PFE Topic</h2>

              <form onSubmit={add} className="space-y-3">
                <input className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />

                <select className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
                  {careers.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <select className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <input className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    placeholder="Stack: comma-separated" value={suggestedStack} onChange={(e)=>setSuggestedStack(e.target.value)} />
                </div>

                <textarea className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  rows={4} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />

                <button className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors">
                  Add PFE Topic
                </button>
              </form>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
              <h2 className="font-bold text-white mb-3">Existing Topics</h2>

              <div className="space-y-3">
                {items.map((x) => (
                  <div key={x._id} className="p-3 rounded-xl bg-slate-900/30 border border-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{x.title}</p>
                        <p className="text-xs text-white/40">
                          {x.careerId?.title ? `Career: ${x.careerId.title}` : "Career"} • {x.difficulty}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          Stack: {(x.suggestedStack || []).join(", ")}
                        </p>
                        {x.description && <p className="text-sm text-white/60 mt-2">{x.description}</p>}
                      </div>
                      <button onClick={() => del(x._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-white/40 text-sm">No topics yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}