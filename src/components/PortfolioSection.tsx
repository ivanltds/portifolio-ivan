import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";
import { trackProjectView } from "../utils/analytics";

type FrameType = "none" | "phone" | "desktop";
interface ProjectImage { url: string; frame: FrameType; }
interface CaseStudyData {
  headline: string; challenge: string; solution: string;
  results: string[]; techStack: string[]; duration: string; role: string;
}
interface Project {
  id: string; title: string; desc: string; link: string;
  tags: string[]; images: (string | ProjectImage)[]; image?: string;
  slug?: string; caseStudy?: CaseStudyData;
}

const FALLBACK: Project[] = [
  { id: "1", title: "Coyotes Basquete", desc: "Landing page estrategica para time de basquete.", link: "https://basquete-coyotes.vercel.app/", tags: ["React", "Tailwind"], images: [], image: "portfolio-coyotes.png" },
  { id: "2", title: "Invite Event (SaaS)", desc: "Plataforma SaaS para gestao de casamentos e eventos.", link: "https://invite-event-beryl.vercel.app/", tags: ["Next.js", "SaaS"], images: [], image: "portfolio-invite.png" },
];

function normalizeImages(raw: (string | ProjectImage)[]): ProjectImage[] {
  return raw.map((img) => typeof img === "string" ? { url: img, frame: "none" } : img);
}
function getImages(p: Project): ProjectImage[] {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  return normalizeImages(imgs as (string | ProjectImage)[]);
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "12px 0 14px" }}>
      <div style={{ width: "220px", background: "#111", borderRadius: "28px", border: "2px solid #222", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "24px", background: "#111" }}>
          <div style={{ width: "8px", height: "8px", background: "#1a1a1a", borderRadius: "50%", border: "1px solid #2a2a2a" }} />
        </div>
        <div style={{ lineHeight: "0", overflow: "hidden" }}>{children}</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", background: "#111" }}>
          <div style={{ width: "48px", height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "3px" }} />
        </div>
      </div>
    </div>
  );
}

function DesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "16px 4px 0" }}>
      <div style={{ border: "6px solid #2a2a2a", borderRadius: "8px", overflow: "hidden", background: "#000", boxShadow: "0 16px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10px", background: "#2a2a2a" }}>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#1a1a1a" }} />
        </div>
        <div style={{ lineHeight: "0" }}>{children}</div>
      </div>
      <div style={{ width: "24px", height: "20px", background: "#2a2a2a", margin: "0 auto" }} />
      <div style={{ width: "80px", height: "5px", background: "#2a2a2a", borderRadius: "3px", margin: "0 auto" }} />
    </div>
  );
}

function Slide({ img, title }: { img: ProjectImage; title: string }) {
  const content = <img src={img.url} alt={title} className="block w-full h-auto object-contain" loading="lazy" decoding="async" />;
  if (img.frame === "phone")   return <PhoneFrame>{content}</PhoneFrame>;
  if (img.frame === "desktop") return <DesktopFrame>{content}</DesktopFrame>;
  return <div className="bg-background">{content}</div>;
}

function Carousel({ images, title }: { images: ProjectImage[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  if (!images.length) return <div className="aspect-video bg-surface flex items-center justify-center text-muted text-xs uppercase tracking-widest">Sem imagem</div>;

  return (
    <div className="relative overflow-hidden bg-surface select-none">
      <Slide img={images[idx]} title={title} />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-1.5 transition-all"><ChevronLeft size={14} /></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-1.5 transition-all"><ChevronRight size={14} /></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-accent" : "bg-white/30"}`} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function PortfolioSection({ getCldUrl }: { getCldUrl: (n: string) => string }) {
  const { content } = useSiteContent();
  const pf = content.portfolio;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects?.length ? d.projects : FALLBACK))
      .catch(() => setProjects(FALLBACK));
  }, []);

  const resolveUrl = (img: ProjectImage) =>
    img.url.startsWith("http") ? img.url : getCldUrl(img.url);

  return (
    <section id="portfolio" className="px-6 lg:px-16 py-20 lg:py-32 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">{pf.label}</span>
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">{pf.title}</h2>
          <p className="text-xl text-muted font-light italic">{pf.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => {
            const imgs = getImages(project).map((img) => ({ ...img, url: resolveUrl(img) }));
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border bg-background group"
              >
                {project.caseStudy ? (
                  <a href={`/projeto/${project.slug || project.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="block">
                    <Carousel images={imgs} title={project.title} />
                  </a>
                ) : (
                  <Carousel images={imgs} title={project.title} />
                )}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    {project.caseStudy ? (
                      <a href={`/projeto/${project.slug || project.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="font-extrabold text-lg tracking-tight leading-tight hover:text-accent transition-colors">
                        {project.title}
                      </a>
                    ) : (
                      <h3 className="font-extrabold text-lg tracking-tight leading-tight">{project.title}</h3>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackProjectView(project.title)}
                      className="shrink-0 p-2 border border-border hover:border-accent hover:text-accent transition-all"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] border border-border px-2 py-1 uppercase tracking-widest font-bold text-muted">{tag}</span>
                    ))}
                  </div>
                  {project.caseStudy && (
                    <a
                      href={`/projeto/${project.slug || project.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                      className="w-full flex items-center justify-center gap-2 border border-accent text-accent py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                    >
                      Ver Case Study
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
