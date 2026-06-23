import { Zap } from "lucide-react";

const painPoints = [
  "Gargalos constantes entre squads e áreas",
  "Arquiteturas frágeis que impedem a evolução",
  "Processos lentos e falta de visibilidade de dados",
  "Dificuldade em integrar IA de forma produtiva",
];

export default function ExperienceSection() {
  return (
    <section id="experiencia" className="px-6 lg:px-16 py-20 lg:py-24 bg-surface/20">
      <div className="max-w-4xl">
        <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">01 — O Contexto</span>
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tighter leading-tight mb-12">
          Sua operação tecnológica trava na hora de escalar?
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <p className="text-lg text-muted leading-relaxed">
            A maioria das empresas enfrenta o mesmo gargalo: falta de previsibilidade, retrabalho constante e uma barreira invisível
            entre a visão de negócio e a execução técnica.
          </p>
          <div className="space-y-6">
            {painPoints.map((item, id) => (
              <div key={id} className="flex items-start gap-4 p-4 border border-border bg-background/50 hover:border-accent/40 transition-colors">
                <Zap size={18} className="text-accent shrink-0 mt-1" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
