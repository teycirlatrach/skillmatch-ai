import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_10%_10%,#B9DDEB,transparent_60%),radial-gradient(900px_600px_at_90%_20%,#EAD26A,transparent_55%),radial-gradient(900px_650px_at_30%_95%,#8EB06A,transparent_55%),linear-gradient(180deg,#070A12,#050711)]" />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-35 bg-[#F0C200]" />
      <div className="absolute top-16 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-[#6B7C1E]" />
      <div className="absolute -bottom-24 left-10 w-80 h-80 rounded-full blur-3xl opacity-25 bg-[#B9DDEB]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left branding panel */}
          <div className="hidden lg:flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F0C200]" />
                <span className="text-sm font-semibold tracking-wide">SkillMatch AI</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold text-white leading-tight">
                Trouve ta voie.
                <br />
                <span className="text-[#B9DDEB]">Formations</span>,{" "}
                <span className="text-[#EAD26A]">métiers</span> &{" "}
                <span className="text-[#8EB06A]">PFE</span>.
              </h1>

              <p className="mt-4 text-white/75 max-w-md">
                Un dashboard clair, un matching intelligent et des favoris pour garder
                tes meilleurs choix.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Matching" value="Score %" color="#B9DDEB" />
              <MiniStat label="Catalog" value="Careers" color="#EAD26A" />
              <MiniStat label="PFE" value="Topics" color="#8EB06A" />
            </div>
          </div>

          {/* Right form card */}
          <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Connexion</h2>
                <p className="text-white/70 mt-1">
                  Connecte-toi pour accéder à ton dashboard.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-sm">
                  Admin / Student
                </span>
              </div>
            </div>

            {err && (
              <div className="mt-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-100">
                {err}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Email">
                <input
                  className="w-full p-3.5 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-[#B9DDEB] focus:ring-2 focus:ring-[#B9DDEB]/30"
                  placeholder="ex: student@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <Field label="Password">
                <input
                  className="w-full p-3.5 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-[#EAD26A] focus:ring-2 focus:ring-[#EAD26A]/30"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Field>

              <button
                disabled={loading}
                className={[
                  "w-full p-3.5 rounded-2xl font-extrabold tracking-wide transition",
                  "bg-[linear-gradient(90deg,#6B7C1E,#8EB06A,#EAD26A,#F0C200)]",
                  "text-slate-950",
                  "hover:opacity-95",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-white/70">
                Pas de compte ?{" "}
                <Link className="text-[#B9DDEB] hover:underline font-semibold" to="/register">
                  Créer un compte
                </Link>
              </p>

              
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-white/80 text-sm font-semibold mb-2">{label}</div>
      {children}
    </label>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-white/80 text-sm font-semibold">{label}</p>
      </div>
      <p className="mt-2 text-white text-xl font-extrabold">{value}</p>
    </div>
  );
}
