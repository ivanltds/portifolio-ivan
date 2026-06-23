import { ArrowRight, BarChart3 } from "lucide-react";

const steps = [
  { num: "01", title: "Análise de Cenário", sub: "Entendimento profundo da sua infra e processos." },
  { num: "02", title: "Reunião Estratégica", sub: "Definição de objetivos e métricas de sucesso." },
  { num: "03", title: "Plano de Execução", sub: "A proposta clara de como chegaremos lá." },
];

export default function ContactSection() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      desafio: formData.get("desafio"),
    };

    const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (btn) btn.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Diagnóstico solicitado com sucesso! Entrarei em contato em breve.");
        (e.target as HTMLFormElement).reset();
      } else {
        const err = await response.json();
        alert(`Erro: ${err.error || "Falha ao enviar"}`);
      }
    } catch {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  return (
    <section id="diagnostico" className="px-6 lg:px-16 py-20 lg:py-32 bg-background border-b border-border">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">05 — Diagnóstico</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-10 text-balance">
            Vamos destravar <br />sua <span className="text-accent underline decoration-4 underline-offset-8">entrega?</span>
          </h2>
          <p className="text-xl text-muted font-light leading-relaxed mb-12 max-w-lg">
            Preencha as informações abaixo. Este diagnóstico é o primeiro passo para transformar caos em previsibilidade.
          </p>
          <div className="space-y-10">
            {steps.map(({ num, title, sub }) => (
              <div key={num} className="flex items-center gap-6 group">
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

        <form onSubmit={handleSubmit} className="bg-surface p-6 sm:p-10 lg:p-14 border border-border space-y-8 relative overflow-hidden">
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
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Qual o maior desafio técnico/operacional hoje?</label>
            <textarea name="desafio" placeholder="Ex: Atrasos constantes, bugs críticos em produção, falta de escala na infra..." rows={4} required className="w-full bg-transparent border border-border p-6 focus:border-accent focus:outline-none transition-colors text-sm font-light resize-none" />
          </div>
          <button type="submit" className="w-full bg-accent text-white py-6 font-bold text-xs uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            Solicitar Diagnóstico Estratégico
            <ArrowRight size={16} />
          </button>
          <p className="text-[9px] text-center text-muted uppercase tracking-[1.5px] font-bold">O envio agora é automático. Entrarei em contato em até 24h.</p>
        </form>
      </div>
    </section>
  );
}
