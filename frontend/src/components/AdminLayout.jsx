import { Link } from "react-router-dom";

export default function AdminLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <nav className="flex gap-2 text-sm">
            <Link className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800" to="/admin/skills">Skills</Link>
            <Link className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800" to="/admin/careers">Careers</Link>
            <Link className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800" to="/admin/formations">Formations</Link>
            <Link className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800" to="/admin/pfe">PFE</Link>
            <Link className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800" to="/dashboard">Back</Link>
          </nav>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
