import { useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Senha incorreta.");
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("admin_token", token);
      onLogin();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <a href="/" className="text-xs font-mono text-muted uppercase tracking-[4px] hover:text-accent transition-colors">
            ← Voltar ao site
          </a>
        </div>

        <div className="mb-10 space-y-2">
          <div className="w-10 h-10 border border-border flex items-center justify-center mb-6">
            <Lock size={16} className="text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Admin</h1>
          <p className="text-xs text-muted uppercase tracking-widest">Área restrita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Senha</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full bg-transparent border-b border-border py-4 pr-10 focus:border-accent focus:outline-none transition-colors text-sm font-light"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 text-xs font-bold uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar"}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>
      </div>
    </div>
  );
}
