import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function TestimonialsSection() {
  const { content } = useSiteContent();
  const tm = content.testimonials;

  if (!tm?.items) return null;

  const featured = tm.items.filter((t) => t.featured).slice(0, 3);
  if (!featured.length) return null;

  return (
    <section id="depoimentos" className="px-6 lg:px-16 py-20 lg:py-32 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{tm.label}</span>
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">{tm.title}</h2>
          <p className="text-xl text-muted font-light italic">{tm.summary}</p>
        </div>

        <div className={`grid gap-8 ${featured.length === 1 ? "md:grid-cols-1 max-w-2xl" : featured.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border p-8 flex flex-col gap-6 relative"
            >
              <Quote size={24} className="text-accent opacity-40 absolute top-6 right-6" />

              <p className="text-sm text-muted leading-relaxed flex-1 italic">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold tracking-tight">{item.name}</div>
                  <div className="text-[10px] text-muted uppercase tracking-widest">{item.role} · {item.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
