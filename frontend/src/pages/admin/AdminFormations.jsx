import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";

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
    <AdminLayout title="Admin — Formations">
      {err && <ErrorBox msg={err} />}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Create Formation</h2>

          <form onSubmit={create} className="mt-3 space-y-2">
            <input className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Provider" value={provider} onChange={(e)=>setProvider(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                type="number" min="1" value={durationWeeks} onChange={(e)=>setDurationWeeks(e.target.value)} />
              <select className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                value={level} onChange={(e)=>setLevel(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <input className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
            <button className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">
              Add Formation
            </button>
          </form>

          <h2 className="font-bold mt-6">Formations</h2>
          <div className="mt-3 space-y-2">
            {formations.map((f) => (
              <button
                key={f._id}
                onClick={() => setSelectedId(f._id)}
                className={[
                  "w-full text-left p-3 rounded-xl border",
                  f._id === selectedId
                    ? "bg-slate-950 border-indigo-600"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <p className="text-xs text-slate-400">
                      {f.level} • {f.durationWeeks} weeks
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Select</span>
                </div>
              </button>
            ))}
            {formations.length === 0 && <p className="text-slate-400 text-sm">No formations yet.</p>}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Formation Details</h2>

          {!selected ? (
            <p className="text-slate-400 mt-3">Select a formation on the left.</p>
          ) : (
            <>
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{selected.title}</p>
                    <p className="text-xs text-slate-400">{selected.provider}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {selected.level} • {selected.durationWeeks} weeks
                    </p>
                    {selected.url && <a className="text-indigo-400 text-sm hover:underline" href={selected.url} target="_blank">Open URL</a>}
                  </div>
                  <button onClick={() => removeFormation(selected._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                    Delete
                  </button>
                </div>
              </div>

              <FormationSkillsPanel formationId={selected._id} allSkills={skills} />
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="mb-4 p-3 rounded-xl bg-red-950 border border-red-900 text-red-200">
      {msg}
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
    <div className="mt-4">
      <h3 className="font-bold">Skills covered / required</h3>
      {err && <ErrorBox msg={err} />}

      <form onSubmit={add} className="mt-3 grid md:grid-cols-4 gap-2">
        <select className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          value={skillId} onChange={(e)=>setSkillId(e.target.value)}>
          {allSkills.map((s) => (
            <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
          ))}
        </select>

        <select className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          value={minLevel} onChange={(e)=>setMinLevel(e.target.value)}>
          <option value={1}>Min Level 1</option>
          <option value={2}>Min Level 2</option>
          <option value={3}>Min Level 3</option>
          <option value={4}>Min Level 4</option>
          <option value={5}>Min Level 5</option>
        </select>

        <input className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          type="number" step="0.05" min="0" max="1"
          value={weight} onChange={(e)=>setWeight(e.target.value)} />

        <button className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">
          Add
        </button>
      </form>

      <div className="mt-3 space-y-2">
        {items.map((x) => (
          <div key={x._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-sm">{x.skillId?.name || "Skill"}</p>
                <p className="text-xs text-slate-400">minLevel: {x.minLevel} • weight: {x.weight}</p>
              </div>
              <button onClick={() => remove(x._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                Delete
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <select className="p-2 rounded-xl bg-slate-900 border border-slate-800"
                value={x.minLevel}
                onChange={(e)=>update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: Number(e.target.value), weight: x.weight })}>
                <option value={1}>Min 1</option>
                <option value={2}>Min 2</option>
                <option value={3}>Min 3</option>
                <option value={4}>Min 4</option>
                <option value={5}>Min 5</option>
              </select>

              <input className="p-2 rounded-xl bg-slate-900 border border-slate-800"
                type="number" step="0.05" min="0" max="1"
                value={x.weight}
                onChange={(e)=>update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: x.minLevel, weight: Number(e.target.value) })}/>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-400 text-sm">No skills linked yet.</p>}
      </div>
    </div>
  );
}
