import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function FaqSection() {
  const { content } = useSiteContent();
  const fq = content.faq;
  const [showAll, setShowAll] = useState(false);

  const featured = fq.questions.filter((q) => q.featured).slice(0, 4);
  const rest = fq.questions.filter((q) => !featured.find((f) => f.id === q.id));

  return (
    <section id="faq" className="px-6 lg:px-16 py-32 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{fq.label}</span>
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">{fq.title}</h2>
          <p className="text-xl text-muted font-light italic">{fq.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {featured.map((item) => (
            <div key={item.id} className="space-y-4">
              <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
                <CheckCircle2 size={16} /> {item.question}
              </h4>
              <p className="text-sm text-muted leading-relaxed border-l border-border pl-6">{item.answer}</p>
            </div>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8"
            >
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAll ? "Ocultar perguntas" : `Ver todas (${rest.length} restantes)`}
            </button>

            {showAll && (
              <div className="grid md:grid-cols-2 gap-10">
                {rest.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest">{item.question}</h4>
                    <p className="text-sm text-muted leading-relaxed border-l border-border pl-6">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
