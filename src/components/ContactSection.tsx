import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, BarChart3, CheckCircle2, MessageCircle } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";
import { trackLeadSubmit } from "../utils/analytics";

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export default function ContactSection() {
  const { content } = useSiteContent();
  const ct = content.contact;
  const footer = content.footer;

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!SITE_KEY || !widgetRef.current) return;

    const render = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        size: "normal",
        callback: (token: string) => { tokenRef.current = token; },
        "expired-callback": () => { tokenRef.current = ""; },
        "error-callback": () => { tokenRef.current = ""; },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) { render(); clearInterval(interval); }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      desafio: formData.get("desafio") as string,
    };

    if (SITE_KEY && !tokenRef.current) {
      setErrorMsg("Complete a verificacao de seguranca antes de enviar.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _to: ct.contactEmail, _turnstile: tokenRef.current }),
      });

      if (response.ok) {
        trackLeadSubmit(data.email);
        setStatus("success");
        formRef.current?.reset();
        tokenRef.current = "";
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      } else {
        const err = await response.json();
        setErrorMsg(err.error || "Falha ao enviar. Tente novamente.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Erro de conexao. Verifique sua internet.");
      setStatus("error");
    }
  };

  return (
    <section id="diagnostico" className="px-6 lg:px-16 py-20 lg:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{ct.label}</span>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-10 text-balance">
              {ct.title} <br /><span className="text-accent underline decoration-4 underline-offset-8">{ct.accentWord}</span>
            </h2>
            <p className="text-xl text-muted font-light leading-relaxed mb-12 max-w-lg">{ct.summary}</p>
            <div className="space-y-10">
              {ct.steps.map(({ id, num, title, sub }) => (
                <div key={id} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center font-mono text-xs group-hover:border-accent group-hover:text-accent transition-colors">
                    {num}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest block">{title}</span>
                    <span className="text-[10px] text-muted uppercase">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {status === "success" ? (
            <div className="bg-surface border border-border p-6 sm:p-10 lg:p-14 flex flex-col items-center justify-center text-center gap-8">
              <div className="w-16 h-16 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold tracking-tighter">Mensagem recebida!</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs">
                  Entrarei em contato em ate 24h. Enquanto isso, pode me chamar direto no WhatsApp.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={`https://wa.me/${footer.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button
                  onClick={() => setStatus("idle")}
                  className="flex-1 py-4 border border-border text-xs font-bold uppercase tracking-widest text-muted hover:text-foreground hover:border-muted transition-all"
                >
                  Novo contato
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="bg-surface p-6 sm:p-10 lg:p-14 border border-border space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BarChart3 size={120} />
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Nome Completo</label>
                  <input type="text" name="nome" placeholder="John Doe" required className="w-full bg-transparent border-b border-border py-4 focus:border-accent focus:outline-none transition-colors text-sm font-light" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">E-mail Corporativo</label>
                  <input type="email" name="email" placeholder="john@company.com" required className="w-full bg-transparent border-b border-border py-4 focus:border-accent focus:outline-none transition-colors text-sm font-light" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Qual o maior desafio tecnico/operacional hoje?</label>
                <textarea name="desafio" placeholder="Ex: Atrasos constantes, bugs criticos em producao, falta de escala na infra..." rows={4} required className="w-full bg-transparent border border-border p-6 focus:border-accent focus:outline-none transition-colors text-sm font-light resize-none" />
              </div>

              {SITE_KEY && <div ref={widgetRef} className="flex justify-start" />}

              {errorMsg && (
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-accent text-white py-6 font-bold text-xs uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</>
                ) : (
                  <>{ct.ctaText} <ArrowRight size={16} /></>
                )}
              </button>
              <p className="text-[9px] text-center text-muted uppercase tracking-[1.5px] font-bold">{ct.formNote}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
