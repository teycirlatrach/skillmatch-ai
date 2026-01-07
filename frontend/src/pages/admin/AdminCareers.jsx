import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";

export default function AdminCareers() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCareerId, setSelectedCareerId] = useState("");

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Web");
  const [description, setDescription] = useState("");

  const [err, setErr] = useState("");
  const selectedCareer = useMemo(
    () => careers.find((c) => c._id === selectedCareerId) || null,
    [careers, selectedCareerId]
  );

  async function load() {
    const [cRes, sRes] = await Promise.all([
      api.get("/careers"),
      api.get("/skills"),
    ]);
    setCareers(cRes.data);
    setSkills(sRes.data);
    if (!selectedCareerId && cRes.data.length) setSelectedCareerId(cRes.data[0]._id);
  }

  async function createCareer(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/careers", { title, domain, description });
      setTitle(""); setDomain("Web"); setDescription("");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create career");
    }
  }

  async function deleteCareer(id) {
    if (!confirm("Delete this career?")) return;
    await api.delete(`/careers/${id}`);
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout title="Admin — Careers">
      {err && <ErrorBox msg={err} />}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* LEFT: Careers list + create */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Create Career</h2>

          <form onSubmit={createCareer} className="mt-3 space-y-2">
            <input
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Title (e.g. Full-Stack Developer)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Domain (e.g. Web, BI, Security)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <textarea
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold">
              Add Career
            </button>
          </form>

          <h2 className="font-bold mt-6">Careers</h2>
          <div className="mt-3 space-y-2">
            {careers.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelectedCareerId(c._id)}
                className={[
                  "w-full text-left p-3 rounded-xl border",
                  c._id === selectedCareerId
                    ? "bg-slate-950 border-indigo-600"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.domain}</p>
                  </div>
                  <span className="text-xs text-slate-400">Select</span>
                </div>
              </button>
            ))}
            {careers.length === 0 && (
              <p className="text-slate-400 text-sm">No careers yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT: Career details + required skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="font-bold">Career Details</h2>

          {!selectedCareer ? (
            <p className="text-slate-400 mt-3">Select a career on the left.</p>
          ) : (
            <>
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{selectedCareer.title}</p>
                    <p className="text-xs text-slate-400">{selectedCareer.domain}</p>
                    <p className="text-sm text-slate-300 mt-2">{selectedCareer.description || "—"}</p>
                  </div>
                  <button
                    onClick={() => deleteCareer(selectedCareer._id)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <CareerSkillsPanel
                careerId={selectedCareer._id}
                allSkills={skills}
              />
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

function CareerSkillsPanel({ careerId, allSkills }) {
  const [items, setItems] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [minLevel, setMinLevel] = useState(2);
  const [weight, setWeight] = useState(0.5);
  const [err, setErr] = useState("");

  async function load() {
    const res = await api.get(`/careers/${careerId}/skills`);
    setItems(res.data);
    if (!skillId && allSkills.length) setSkillId(allSkills[0]._id);
  }

  async function add(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post(`/careers/${careerId}/skills`, {
        skillId,
        minLevel: Number(minLevel),
        weight: Number(weight),
      });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add required skill");
    }
  }

  async function update(id, patch) {
    await api.put(`/careers/${careerId}/skills/${id}`, patch);
    await load();
  }

  async function remove(id) {
    await api.delete(`/careers/${careerId}/skills/${id}`);
    await load();
  }

  useEffect(() => { load(); }, [careerId, allSkills]);

  return (
    <div className="mt-4">
      <h3 className="font-bold">Required Skills</h3>

      {err && <ErrorBox msg={err} />}

      <form onSubmit={add} className="mt-3 grid md:grid-cols-4 gap-2">
        <select
          className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          value={skillId}
          onChange={(e) => setSkillId(e.target.value)}
        >
          {allSkills.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.category})
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          value={minLevel}
          onChange={(e) => setMinLevel(e.target.value)}
        >
          <option value={1}>Min Level 1</option>
          <option value={2}>Min Level 2</option>
          <option value={3}>Min Level 3</option>
          <option value={4}>Min Level 4</option>
          <option value={5}>Min Level 5</option>
        </select>

        <input
          className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          type="number"
          step="0.05"
          min="0"
          max="1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (0..1)"
        />

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
                <p className="text-xs text-slate-400">
                  minLevel: {x.minLevel} • weight: {x.weight}
                </p>
              </div>
              <button onClick={() => remove(x._id)} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                Delete
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                className="p-2 rounded-xl bg-slate-900 border border-slate-800"
                value={x.minLevel}
                onChange={(e) => update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: Number(e.target.value), weight: x.weight })}
              >
                <option value={1}>Min 1</option>
                <option value={2}>Min 2</option>
                <option value={3}>Min 3</option>
                <option value={4}>Min 4</option>
                <option value={5}>Min 5</option>
              </select>

              <input
                className="p-2 rounded-xl bg-slate-900 border border-slate-800"
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={x.weight}
                onChange={(e) => update(x._id, { skillId: x.skillId?._id || x.skillId, minLevel: x.minLevel, weight: Number(e.target.value) })}
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-slate-400 text-sm mt-2">
            No required skills yet. Add at least 3 skills with weights.
          </p>
        )}
      </div>
    </div>
  );
}
