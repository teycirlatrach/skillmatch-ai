import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function AdminFormations() {
  const [formations, setFormations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("SkillMatch Academy");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [level, setLevel] = useState("Beginner");
  const [url, setUrl] = useState("");

  const [err, setErr] = useState("");
  const selected = useMemo(
    () => formations.find((f) => f._id === selectedId) || null,
    [formations, selectedId]
  );

  async function load() {
    const [fRes, sRes] = await Promise.all([
      api.get("/formations"),
      api.get("/skills"),
    ]);
    setFormations(fRes.data);
    setSkills(sRes.data);
    if (!selectedId && fRes.data.length) setSelectedId(fRes.data[0]._id);
  }

  async function create(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/formations", { title, provider, durationWeeks: Number(durationWeeks), level, url });
      setTitle(""); setProvider("SkillMatch Academy"); setDurationWeeks(4); setLevel("Beginner"); setUrl("");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create formation");
    }
  }

  async function removeFormation(id) {
    if (!confirm("Delete this formation?")) return;
    await api.delete(`/formations/${id}`);
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
              <h1 className="text-2xl font-bold text-white">Admin — Formations</h1>
              <p className="text-white/60 mt-1">Create and manage formations with required skills</p>
            </div>
            <Link to="/admin" className="btn-gradient">
              ← Back to Admin
            </Link>
          </div>

          {err && <ErrorBox msg={err} />}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
              <h2 className="font-bold text-white mb-3">Create Formation</h2>

              <form onSubmit={create} className="space-y-3 mb-6">
                <input className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <input className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  placeholder="Provider" value={provider} onChange={(e)=>setProvider(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    type="number" min="1" value={durationWeeks} onChange={(e)=>setDurationWeeks(e.target.value)} />
                  <select className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    value={level} onChange={(e)=>setLevel(e.target.value)}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <input className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  placeholder="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
                <button className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors">
                  Add Formation
                </button>
              </form>

              <h2 className="font-bold text-white mb-3">Formations</h2>
              <div className="space-y-2">
                {formations.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => setSelectedId(f._id)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      f._id === selectedId
                        ? "bg-slate-900 border-indigo-600"
                        : "bg-slate-900/50 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white">{f.title}</p>
                        <p className="text-xs text-white/40">
                          {f.level} • {f.durationWeeks} weeks
                        </p>
                      </div>
                      <span className="text-xs text-white/40">Select</span>
                    </div>
                  </button>
                ))}
                {formations.length === 0 && <p className="text-white/40 text-sm">No formations yet.</p>}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10">
              <h2 className="font-bold text-white mb-3">Formation Details</h2>

              {!selected ? (
                <p className="text-white/40">Select a formation on the left.</p>
              ) : (
                <>
                  <div className="mb-6 p-4 rounded-xl bg-slate-900/30 border border-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{selected.title}</p>
                        <p className="text-xs text-white/40">{selected.provider}</p>
                        <p className="text-xs text-white/40 mt-1">
                          {selected.level} • {selected.durationWeeks} weeks
                        </p>
                        {selected.url && (
                          <a className="text-indigo-400 text-sm hover:underline mt-2 inline-block" href={selected.url} target="_blank" rel="noreferrer">
                            Open URL
                          </a>
                        )}
                      </div>
                      <button onClick={() => removeFormation(selected._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>

                  <FormationSkillsPanel formationId={selected._id} allSkills={skills} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-700/50">
      <p className="text-red-200">{msg}</p>
    </div>
  );
}

function FormationSkillsPanel({ formationId, allSkills }) {
  const [items, setItems] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [minLevel, setMinLevel] = useState(1);
  const [weight, setWeight] = useState(0.5);
  const [err, setErr] = useState("");

  async function load() {
    const res = await api.get(`/formations/${formationId}/skills`);
    setItems(res.data);
    if (!skillId && allSkills.length) setSkillId(allSkills[0]._id);
  }

  async function add(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post(`/formations/${formationId}/skills`, {
        skillId,
        minLevel: Number(minLevel),
        weight: Number(weight),
      });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add formation skill");
    }
  }

  async function update(id, patch) {
    await api.put(`/formations/${formationId}/skills/${id}`, patch);
    await load();
  }

  async function remove(id) {
    await api.delete(`/formations/${formationId}/skills/${id}`);
    await load();
  }

  useEffect(() => { load(); }, [formationId, allSkills]);

  return (
    <div>
      <h3 className="font-bold text-white mb-3">Skills covered / required</h3>
      {err && <ErrorBox msg={err} />}

      <form onSubmit={add} className="grid md:grid-cols-4 gap-2 mb-4">
        <select className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
          value={skillId} onChange={(e)=>setSkillId(e.target.value)}>
          {allSkills.map((s) => (
            <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
          ))}
        </select>

        <select className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
          value={minLevel} onChange={(e)=>setMinLevel(e.target.value)}>
          <option value={1}>Min Level 1</option>
          <option value={2}>Min Level 2</option>
          <option value={3}>Min Level 3</option>
          <option value={4}>Min Level 4</option>
          <option value={5}>Min Level 5</option>
        </select>

        <input className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
          type="number" step="0.05" min="0" max="1"
          value={weight} onChange={(e)=>setWeight(e.target.value)} />

        <button className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {items.map((x) => (
          <div key={x._id} className="p-3 rounded-xl bg-slate-900/30 border border-white/5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-sm text-white">{x.skillId?.name || "Skill"}</p>
                <p className="text-xs text-white/40">minLevel: {x.minLevel} • weight: {x.weight}</p>
              </div>
              <button onClick={() => remove(x._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                value={x.minLevel}
                onChange={(e)=>update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: Number(e.target.value), weight: x.weight })}>
                <option value={1}>Min 1</option>
                <option value={2}>Min 2</option>
                <option value={3}>Min 3</option>
                <option value={4}>Min 4</option>
                <option value={5}>Min 5</option>
              </select>

              <input className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                type="number" step="0.05" min="0" max="1"
                value={x.weight}
                onChange={(e)=>update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: x.minLevel, weight: Number(e.target.value) })}/>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/40 text-sm">No skills linked yet.</p>}
      </div>
    </div>
  );
}