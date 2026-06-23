import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

type FrameType = "none" | "phone" | "desktop";

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: string[];
  image?: string;
  frameType?: FrameType;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Coyotes Basquete",
    desc: "Landing page estratégica para time de basquete. Gestão de inscrições em eventos, treinos e captação de novos atletas.",
    link: "https://basquete-coyotes.vercel.app/",
    tags: ["React", "Vite", "Tailwind", "Gestão de Eventos"],
    images: [], image: "portfolio-coyotes.png", frameType: "none",
  },
  {
    id: "2",
    title: "Invite Event (SaaS)",
    desc: "Plataforma SaaS para gestão de casamentos e eventos sociais, com convites personalizados e controle de convidados.",
    link: "https://invite-event-beryl.vercel.app/",
    tags: ["SaaS", "Next.js", "Arquitetura", "UX Design"],
    images: [], image: "portfolio-invite.png", frameType: "none",
  },
];

function getImages(p: Project): string[] {
  if (p.images?.length > 0) return p.images;
  if (p.image?.startsWith("http")) return [p.image];
  return [];
}

// ─── Moldura de celular (iPhone style) ────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center py-8 px-4 bg-background">
      <div className="relative" style={{ width: "240px" }}>
        {/* Corpo do celular */}
        <div style={{
          background: "linear-gradient(160deg, #2e2e2e 0%, #1a1a1a 100%)",
          borderRadius: "44px",
          padding: "14px 10px",
          boxShadow:
            "0 0 0 1px #111, 0 0 0 2px #3a3a3a, 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          {/* Dynamic Island */}
          <div style={{
            width: "80px", height: "24px",
            background: "#000",
            borderRadius: "20px",
            margin: "0 auto 8px",
          }} />
          {/* Tela */}
          <div style={{ borderRadius: "30px", overflow: "hidden", background: "#000" }}>
            {children}
          </div>
          {/* Home indicator */}
          <div style={{
            width: "60px", height: "4px",
            background: "rgba(255,255,255,0.25)",
            borderRadius: "4px",
            margin: "10px auto 0",
          }} />
        </div>
        {/* Botões laterais esquerdos */}
        {[70, 110, 150].map((top, i) => (
          <div key={i} style={{
            position: "absolute", left: "-4px", top: `${top}px`,
            width: "3px", height: i === 0 ? "24px" : "38px",
            background: "linear-gradient(to right, #1a1a1a, #2e2e2e)",
            borderRadius: "2px 0 0 2px",
          }} />
        ))}
        {/* Botão direito */}
        <div style={{
          position: "absolute", right: "-4px", top: "100px",
          width: "3px", height: "56px",
          background: "linear-gradient(to left, #1a1a1a, #2e2e2e)",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>
    </div>
  );
}

// ─── Moldura de monitor (iMac style) ─────────────────────────────────────────
function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background py-6 px-2">
      {/* Monitor */}
      <div style={{
        background: "linear-gradient(160deg, #2e2e2e 0%, #1c1c1c 100%)",
        borderRadius: "14px",
        padding: "12px 12px 10px",
        boxShadow:
          "0 0 0 1px #111, 0 0 0 2px #3a3a3a, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}>
        {/* Bezel superior com câmera */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "18px", marginBottom: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3a3a3a", boxShadow: "0 0 0 1px #222" }} />
        </div>
        {/* Tela */}
        <div style={{ borderRadius: "6px", overflow: "hidden", background: "#000" }}>
          {children}
        </div>
        {/* Bezel inferior */}
        <div style={{ height: "8px" }} />
      </div>
      {/* Pescoço do suporte */}
      <div style={{
        width: "36px", height: "28px",
        background: "linear-gradient(to bottom, #2a2a2a, #1e1e1e)",
        margin: "0 auto",
      }} />
      {/* Base */}
      <div style={{
        width: "110px", height: "7px",
        background: "linear-gradient(to bottom, #2e2e2e, #1a1a1a)",
        borderRadius: "0 0 6px 6px",
        margin: "0 auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }} />
    </div>
  );
}

// ─── Carrossel ────────────────────────────────────────────────────────────────
function Carousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, images.length]);

  if (images.length === 0) {
    return (
      <div className="h-48 bg-surface flex items-center justify-center">
        <span className="text-xs text-muted/30 uppercase tracking-widest">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${title} — ${i + 1}`}
          className={`block w-full h-auto object-contain transition-opacity duration-700
            ${i === current ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          loading="lazy"
          decoding="async"
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 p-1.5 opacity-0 group-hover/carousel:opacity-100 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 p-1.5 opacity-0 group-hover/carousel:opacity-100 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={14} className="text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40 w-1.5"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Wrapper de moldura ───────────────────────────────────────────────────────
function FrameWrapper({ frameType, children }: { frameType: FrameType; children: React.ReactNode }) {
  if (frameType === "phone")   return <PhoneFrame>{children}</PhoneFrame>;
  if (frameType === "desktop") return <DesktopFrame>{children}</DesktopFrame>;
  return (
    <div className="border border-border hover:border-accent/50 transition-colors duration-300 bg-background overflow-hidden">
      {children}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface Props { getCldUrl: (name: string) => string; }

export default function PortfolioSection({ getCldUrl }: Props) {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.projects?.length) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  return (
    <section id="portfolio" className="px-6 lg:px-16 py-20 lg:py-32 border-b border-border bg-background">
      <div className="max-w-4xl mb-12 lg:mb-20">
        <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">02 — Portfólio</span>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">
          Aplicações em <span className="text-accent italic">produção.</span>
        </h2>
        <p className="text-lg lg:text-xl text-muted font-light">
          Projetos reais que resolvem problemas reais. Da estratégia de entrega ao código final.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project, idx) => {
          const images = getImages(project);
          const resolvedImages = images.length > 0
            ? images
            : project.image && !project.image.startsWith("http")
              ? [getCldUrl(project.image)]
              : [];
          const frameType = project.frameType || "none";

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group"
            >
              <FrameWrapper frameType={frameType}>
                <Carousel images={resolvedImages} title={project.title} />
              </FrameWrapper>

              <div className="pt-8 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold tracking-tight uppercase">{project.title}</h3>
                  <a href={project.link} target="_blank" rel="noreferrer"
                    className="p-3 border border-border hover:bg-accent hover:text-white transition-all">
                    <ExternalLink size={18} />
                  </a>
                </div>
                <p className="text-sm text-muted leading-relaxed font-light">{project.desc}</p>
                <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pt-2 -mx-1 px-1">
                  {project.tags.map((tag) => (
                    <span key={tag}
                      className="text-[11px] font-bold font-sans border border-border px-3 py-1 uppercase text-muted group-hover:text-accent group-hover:border-accent transition-colors tracking-tight whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
