import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function MySkills() {
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);

  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState(3);

  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setErr("");
    const [skillsRes, myRes] = await Promise.all([
      api.get("/skills"),
      api.get("/me/skills"),
    ]);
    setAllSkills(skillsRes.data);
    setMySkills(myRes.data);
    if (!skillId && skillsRes.data.length) setSkillId(skillsRes.data[0]._id);
  }

  async function add(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api.post("/me/skills", { skillId, level: Number(level) });
      setMsg("Skill added ✅");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add skill");
    }
  }

  async function update(id, newLevel) {
    await api.patch(`/me/skills/${id}`, { level: Number(newLevel) });
    await load();
  }

  async function remove(id) {
    await api.delete(`/me/skills/${id}`);
    await load();
  }

  useEffect(() => { load(); }, []);

  const filteredSkills = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return allSkills;
    return allSkills.filter(x =>
      (x.name || "").toLowerCase().includes(s) ||
      (x.category || "").toLowerCase().includes(s)
    );
  }, [allSkills, q]);

  return (
    <div className="ui-page">
      <div className="ui-bg"></div>
      <div className="ui-container">
        <div className="card-glass">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">My Skills</h1>
              <p className="text-white/60 mt-1">
                Add skills with your level (1 beginner → 5 expert).
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn-gradient">
                Back
              </Link>
              <Link to="/profile" className="btn-gradient">
                My Profile
              </Link>
            </div>
          </div>

          {err && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
              <p className="text-red-200">{err}</p>
            </div>
          )}
          {msg && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-900/30 border border-emerald-700/50">
              <p className="text-emerald-200">{msg}</p>
            </div>
          )}

          {/* Search */}
          <input
            className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder:text-white/40 mb-4"
            placeholder="Search skills (ex: python, sql, react...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {/* Add */}
          <form onSubmit={add} className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              <select
                className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
              >
                {filteredSkills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>

              <select
                className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Basic</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
                <option value={5}>5 - Expert</option>
              </select>

              <button className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-colors">
                Add Skill
              </button>
            </div>
          </form>

          {/* List */}
          <div className="grid md:grid-cols-2 gap-4">
            {mySkills.map((x) => (
              <div key={x._id} className="p-4 rounded-2xl bg-slate-900/50 border border-white/10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white">{x.skillId?.name || "Skill"}</p>
                    <p className="text-sm text-white/40">{x.skillId?.category}</p>
                  </div>
                  <button
                    onClick={() => remove(x._id)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60">Level</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={x.level}
                    onChange={(e) => update(x._id, e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm px-3 py-1 rounded-lg bg-black/30">{x.level}</span>
                </div>
              </div>
            ))}
          </div>

          {mySkills.length === 0 && (
            <p className="text-white/60 py-6 text-center">
              No skills yet. Add at least 3 skills to get better recommendation scores.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}