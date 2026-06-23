import { Workflow, Database, Cpu, Settings, ShieldCheck, TrendingUp } from "lucide-react";

const services = [
  {
    icon: <Workflow />,
    title: "Delivery & Gestão",
    desc: "Consultoria em Kanban, Scrum e otimização de fluxo. Transformação de times lentos em máquinas de entrega previsíveis.",
    tags: ["Squads", "Métricas", "Governança"],
  },
  {
    icon: <Database />,
    title: "Arquitetura & Backend",
    desc: "Desenvolvimento robusto com .NET, Java, Node e Python. Microserviços, DDD e foco total em performance e segurança.",
    tags: ["Cloud", "SQL/NoSQL", "DevOps"],
  },
  {
    icon: <Cpu />,
    title: "Engenharia de IA",
    desc: "Uso estratégico de LLMs e automações (n8n, Make) para acelerar design de soluções e produtividade operacional.",
    tags: ["LLMs", "Automatização", "AI Core"],
  },
  {
    icon: <Settings />,
    title: "Automação Industrial",
    desc: "Otimização de processos complexos através de software personalizado que reduz intervenção manual e erro humano.",
    tags: ["Workflow", "Integrações", "Efficiency"],
  },
  {
    icon: <ShieldCheck />,
    title: "Segurança & Escala",
    desc: "Preparação de infraestruturas para picos de tráfego, garantindo disponibilidade e integridade dos dados sob pressão.",
    tags: ["Scaling", "Robustness", "SLA"],
  },
  {
    icon: <TrendingUp />,
    title: "Growth & CRO Tech",
    desc: "Implementação técnica de funis de venda e ferramentas de análise que permitem decisões baseadas em dados reais.",
    tags: ["Analytics", "Data-Driven", "Conversion"],
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="px-6 lg:px-16 py-20 lg:py-32 bg-background relative border-b border-border">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-20 gap-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">02 — Serviços</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">Expertise que gera valor.</h2>
          <p className="text-lg lg:text-xl text-muted font-light">Ofereço soluções sob medida, do desenho estratégico à implementação técnica.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="group p-10 bg-surface/50 border border-border hover:border-accent/40 transition-all flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="w-12 h-12 border border-border flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-white transition-all">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 uppercase">{service.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-10">{service.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-bold font-sans border border-border px-3 py-1 uppercase tracking-tight">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
