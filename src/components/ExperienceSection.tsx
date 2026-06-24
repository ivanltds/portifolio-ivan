import { Zap } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function ExperienceSection() {
  const { content } = useSiteContent();
  const ex = content.experience;

  return (
    <section id="experiencia" className="px-6 lg:px-16 py-20 lg:py-24 bg-surface/20">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{ex.label}</span>
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tighter leading-tight mb-12">
          {ex.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <p className="text-lg text-muted leading-relaxed">{ex.paragraph}</p>
          <div className="space-y-6">
            {ex.painPoints.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border border-border bg-background/50 hover:border-accent/40 transition-colors">
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
