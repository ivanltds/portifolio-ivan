import { ArrowRight } from "lucide-react";
import { scrollToSection } from "../utils/scroll";

const steps = [
  { step: "01", title: "Diagnóstico & Fluxo", desc: "Mapeamento de gargalos, análise de métricas (DORA Metrics) e identificação de silos operacionais." },
  { step: "02", title: "Arquitetura & Base", desc: "Refatoração ou estruturação de backend robusto, garantindo que a tecnologia suporte o crescimento planejado." },
  { step: "03", title: "Escala & Governança", desc: "Implementação de frameworks ágeis (Scrum/Kanban) e dashboards de gestão para visibilidade total." },
  { step: "04", title: "Aceleração com IA", desc: "Integração de agentes autônomos e automações de processos para liberar o time para o que realmente importa." },
];

export default function MethodSection() {
  return (
    <section id="metodo" className="px-6 lg:px-16 py-32 border-b border-border bg-surface/[0.1]">
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">03 — O Método</span>
          <h2 className="text-5xl font-extrabold tracking-tighter leading-tight mb-8">
            Como eu transformo <br />sua operação.
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Meu processo é pragmático e direto. Eu busco a clareza operacional primeiro, estabilizo a base tecnológica e então acelero
            através de automação e dados.
          </p>
          <button onClick={() => scrollToSection("diagnostico")} className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-full border border-accent flex items-center justify-center group-hover:bg-accent transition-all">
              <ArrowRight className="group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest group-hover:text-accent transition-colors">Iniciar Diagnóstico</span>
          </button>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-8 p-8 border border-border hover:bg-surface/40 transition-all cursor-default bg-background">
              <span className="font-mono text-accent text-3xl font-black">{item.step}</span>
              <div>
                <h4 className="text-lg font-bold uppercase tracking-widest mb-2">{item.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
