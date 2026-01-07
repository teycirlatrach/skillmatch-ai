import { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";

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
    <AdminLayout title="Admin — PFE Topics">
      {err && <div className="mb-4 p-3 rounded-xl bg-red-950 border border-red-900 text-red-200">{err}</div>}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Create PFE Topic</h2>

          <form onSubmit={add} className="mt-3 space-y-2">
            <input className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />

            <select className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
              {careers.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <select className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <input className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                placeholder="Stack: comma-separated" value={suggestedStack} onChange={(e)=>setSuggestedStack(e.target.value)} />
            </div>

            <textarea className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              rows={4} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />

            <button className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">
              Add PFE Topic
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Existing Topics</h2>

          <div className="mt-3 space-y-2">
            {items.map((x) => (
              <div key={x._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{x.title}</p>
                    <p className="text-xs text-slate-400">
                      {x.careerId?.title ? `Career: ${x.careerId.title}` : "Career"} • {x.difficulty}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Stack: {(x.suggestedStack || []).join(", ")}
                    </p>
                    {x.description && <p className="text-sm text-slate-300 mt-2">{x.description}</p>}
                  </div>
                  <button onClick={() => del(x._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-slate-400 text-sm">No topics yet.</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
