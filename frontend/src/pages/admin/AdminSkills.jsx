import { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";

export default function AdminSkills() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Web");
  const [err, setErr] = useState("");

  async function load() {
    const res = await api.get("/skills");
    setItems(res.data);
  }

  async function add(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/skills", { name, category });
      setName("");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  async function del(id) {
    await api.delete(`/skills/${id}`);
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout title="Admin — Skills">
      {err && <div className="p-3 rounded-xl bg-red-950 border border-red-900 text-red-200">{err}</div>}

      <form onSubmit={add} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-2">
        <input className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800"
          placeholder="Skill name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-48 p-3 rounded-xl bg-slate-950 border border-slate-800"
          placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
        <button className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">Add</button>
      </form>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        {items.map(s => (
          <div key={s._id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-slate-400">{s.category}</p>
            </div>
            <button onClick={() => del(s._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
