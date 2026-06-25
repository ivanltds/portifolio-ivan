import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Clock, User, Tag } from "lucide-react";
import { motion } from "motion/react";

type FrameType = "none" | "phone" | "desktop";
interface ProjectImage { url: string; frame: FrameType; }
interface CaseStudyData {
  headline: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  duration: string;
  role: string;
}
interface Project {
  id: string; title: string; desc: string; link: string;
  tags: string[]; images: (string | ProjectImage)[]; image?: string;
  slug?: string; caseStudy?: CaseStudyData;
}

function normalizeImages(raw: (string | ProjectImage)[]): ProjectImage[] {
  return raw.map((img) => typeof img === "string" ? { url: img, frame: "none" as FrameType } : img);
}

function PhoneFrame({ url }: { url: string }) {
  return (
    <div className="relative mx-auto w-48 border-4 border-border rounded-[2rem] overflow-hidden bg-black shadow-2xl">
      <img src={url} alt="" className="w-full h-auto block" />
    </div>
  );
}
function DesktopFrame({ url }: { url: string }) {
  return (
    <div className="relative border-2 border-border rounded bg-black shadow-2xl overflow-hidden">
      <div className="h-5 bg-surface flex items-center gap-1 px-3">
        <span className="w-2 h-2 rounded-full bg-border" />
        <span className="w-2 h-2 rounded-full bg-border" />
        <span className="w-2 h-2 rounded-full bg-border" />
      </div>
      <img src={url} alt="" className="w-full h-auto block" />
    </div>
  );
}

export default function CaseStudy() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = window.location.pathname.split("/projeto/")[1]?.split("/")[0];

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        const found = data.find(
          (p) => (p.slug || p.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")) === slug
        );
        setProject(found || null);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project || !project.caseStudy) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-6">
        <h1 className="text-4xl font-extrabold tracking-tighter">Case study não encontrado</h1>
        <a href="/#portfolio" className="text-accent underline text-sm">← Voltar ao portfólio</a>
      </div>
    );
  }

  const cs = project.caseStudy;
  const images = normalizeImages(project.images?.length ? project.images : project.image ? [project.image] : []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-5 border-b border-border bg-background/90 backdrop-blur-sm flex items-center justify-between">
        <a
          href="/#portfolio"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> Portfólio
        </a>
        {project.link && (
          <a
            href={project.link} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
          >
            Ver projeto <ExternalLink size={12} />
          </a>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-16 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((t) => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-widest border border-border px-3 py-1 text-muted">{t}</span>
              ))}
            </div>
            <h1 className="text-5xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-6">{project.title}</h1>
            <p className="text-2xl lg:text-3xl text-accent font-light italic mb-10">{cs.headline}</p>
            <div className="flex flex-wrap gap-8">
              {cs.duration && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Clock size={14} className="text-accent" />
                  <span>{cs.duration}</span>
                </div>
              )}
              {cs.role && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <User size={14} className="text-accent" />
                  <span>{cs.role}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Images */}
      {images.length > 0 && (
        <section className="py-16 px-6 lg:px-16 border-b border-border bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className={`grid gap-8 ${images.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : images.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {images.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  {img.frame === "phone" ? <PhoneFrame url={img.url} /> :
                   img.frame === "desktop" ? <DesktopFrame url={img.url} /> :
                   <img src={img.url} alt="" className="w-full h-auto border border-border" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-16 py-20 space-y-20">
        {/* Desafio */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[10px] font-mono text-accent uppercase tracking-[4px] mb-4 block">01 — O Desafio</span>
          <p className="text-xl lg:text-2xl font-light leading-relaxed text-muted whitespace-pre-line">{cs.challenge}</p>
        </motion.div>

        {/* Solução */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[10px] font-mono text-accent uppercase tracking-[4px] mb-4 block">02 — A Solução</span>
          <p className="text-xl lg:text-2xl font-light leading-relaxed text-muted whitespace-pre-line">{cs.solution}</p>
        </motion.div>

        {/* Resultados */}
        {cs.results?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] font-mono text-accent uppercase tracking-[4px] mb-8 block">03 — Resultados</span>
            <div className="grid sm:grid-cols-2 gap-4">
              {cs.results.map((r, i) => (
                <div key={i} className="border border-accent/30 bg-accent/5 p-6">
                  <p className="text-sm font-light leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        {cs.techStack?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] font-mono text-accent uppercase tracking-[4px] mb-6 block">04 — Tech Stack</span>
            <div className="flex flex-wrap gap-3">
              {cs.techStack.map((t) => (
                <div key={t} className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted">
                  <Tag size={10} className="text-accent" /> {t}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer CTA */}
      <section className="border-t border-border px-6 lg:px-16 py-20 text-center">
        <p className="text-xs font-mono text-muted uppercase tracking-[4px] mb-6">Tem um desafio parecido?</p>
        <a
          href="/#diagnostico"
          className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 font-bold text-xs uppercase tracking-[2px] hover:bg-blue-700 transition-all"
        >
          Falar com Ivan
        </a>
      </section>
    </div>
  );
}
