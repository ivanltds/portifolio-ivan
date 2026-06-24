import { Workflow, Database, Cpu, Settings, ShieldCheck, TrendingUp, Code, Globe, Zap, Users, Lock, BarChart3, Bot, Layers } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const ICON_MAP: Record<string, React.ElementType> = {
  workflow: Workflow, database: Database, cpu: Cpu, settings: Settings,
  "shield-check": ShieldCheck, "trending-up": TrendingUp, code: Code,
  globe: Globe, zap: Zap, users: Users, lock: Lock,
  "bar-chart": BarChart3, bot: Bot, layers: Layers,
};

export default function ServicesSection() {
  const { content } = useSiteContent();
  const sv = content.services;
  const active = sv.cards.filter((c) => c.enabled && c.title);

  return (
    <section id="servicos" className="px-6 lg:px-16 py-20 lg:py-32 bg-background relative border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{sv.label}</span>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">{sv.title}</h2>
            <p className="text-lg lg:text-xl text-muted font-light">{sv.summary}</p>
          </div>
        </div>

        <div className={`grid gap-8 ${active.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {active.map((service) => {
            const Icon = ICON_MAP[service.icon] || Workflow;
            return (
              <div key={service.id} className="group p-10 bg-surface/50 border border-border hover:border-accent/40 transition-all flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon size={20} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
