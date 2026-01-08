import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER WITH BACK BUTTON - FULL WIDTH */}
      <div className="border-b border-white/10 bg-slate-900/50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin" 
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Admin — Skills</h1>
                <p className="text-white/60 mt-1">Create and manage skills for the platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - FULL WIDTH */}
      <div className="px-6 py-6">
        {err && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
            <p className="text-red-200">{err}</p>
          </div>
        )}

        {/* ADD SKILL FORM - FULL WIDTH */}
        <div className="mb-8 p-6 rounded-2xl bg-slate-900/30 border border-white/10">
          <h2 className="font-bold text-white mb-6 text-xl">Add New Skill</h2>
          <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">Skill name</label>
              <input
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter skill name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">Category</label>
              <select
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Web">Web</option>
                <option value="Data">Data</option>
                <option value="Cyber">Cyber</option>
                <option value="Mobile">Mobile</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="AI">AI</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors text-lg"
              >
                Add Skill
              </button>
            </div>
          </form>
        </div>

        {/* SKILLS LIST - FULL WIDTH GRID */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white text-xl">All Skills <span className="text-indigo-400">({items.length})</span></h2>
            <p className="text-white/40 text-sm">Click Delete to remove a skill</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {items.map(s => (
              <div 
                key={s._id} 
                className="group p-4 rounded-xl bg-slate-900/30 border border-white/10 hover:border-indigo-500/50 transition-all duration-200 hover:bg-slate-900/50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg mb-2 truncate">{s.name}</p>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5">
                      <span className="text-sm text-white/70">{s.category}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => del(s._id)}
                      className="w-full px-4 py-2.5 rounded-lg bg-red-900/30 hover:bg-red-800/40 text-red-300 hover:text-red-200 font-medium transition-colors group-hover:scale-[1.02]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-slate-900/20">
              <div className="text-white/40 mb-4 text-4xl">📚</div>
              <p className="text-white/60 text-lg">No skills added yet</p>
              <p className="text-white/40 mt-2">Add your first skill using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}