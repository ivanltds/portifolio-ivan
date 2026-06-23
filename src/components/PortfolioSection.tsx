import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

type FrameType = "none" | "phone" | "desktop";

interface ProjectImage { url: string; frame: FrameType; }

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: (string | ProjectImage)[];
  image?: string;
}

const FALLBACK: Project[] = [
  { id: "1", title: "Coyotes Basquete", desc: "Landing page estratégica para time de basquete.", link: "https://basquete-coyotes.vercel.app/", tags: ["React", "Tailwind"], images: [], image: "portfolio-coyotes.png" },
  { id: "2", title: "Invite Event (SaaS)", desc: "Plataforma SaaS para gestão de casamentos e eventos.", link: "https://invite-event-beryl.vercel.app/", tags: ["Next.js", "SaaS"], images: [], image: "portfolio-invite.png" },
];

function normalizeImages(raw: (string | ProjectImage)[]): ProjectImage[] {
  return raw.map((img) => typeof img === "string" ? { url: img, frame: "none" } : img);
}

function getImages(p: Project): ProjectImage[] {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  return normalizeImages(imgs as (string | ProjectImage)[]);
}

// ─── Moldura celular ──────────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0" }}>
      <div style={{ position: "relative", width: "200px" }}>
        {/* Sombra externa */}
        <div style={{
          position: "absolute", inset: "-2px",
          borderRadius: "46px",
          background: "linear-gradient(145deg, #444 0%, #222 100%)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }} />
        {/* Corpo */}
        <div style={{
          position: "relative",
          background: "linear-gradient(160deg, #2c2c2c 0%, #181818 100%)",
          borderRadius: "44px",
          padding: "12px 8px 16px",
        }}>
          {/* Dynamic Island */}
          <div style={{
            width: "72px", height: "22px",
            background: "#000",
            borderRadius: "16px",
            margin: "0 auto 8px",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }} />
          {/* Tela */}
          <div style={{ borderRadius: "28px", overflow: "hidden", background: "#000", lineHeight: 0 }}>
            {children}
          </div>
          {/* Home bar */}
          <div style={{
            width: "52px", height: "3px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "3px",
            margin: "12px auto 0",
          }} />
        </div>
        {/* Botões esquerdos */}
        <div style={{ position: "absolute", left: "-3px", top: "64px", width: "2px", height: "22px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: "-3px", top: "96px", width: "2px", height: "34px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: "-3px", top: "138px", width: "2px", height: "34px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        {/* Botão direito */}
        <div style={{ position: "absolute", right: "-3px", top: "90px", width: "2px", height: "48px", background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />
      </div>
    </div>
  );
}

// ─── Moldura desktop ──────────────────────────────────────────────────────────
function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 8px 0" }}>
      {/* Monitor */}
      <div style={{
        position: "relative",
        background: "linear-gradient(160deg, #2c2c2c 0%, #181818 100%)",
        borderRadius: "10px",
        padding: "10px 10px 8px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.6)",
      }}>
        {/* Câmera */}
        <div style={{ display: "flex", justifyContent: "center", height: "14px", alignItems: "center", marginBottom: "5px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#353535" }} />
        </div>
        {/* Tela */}
        <div style={{ borderRadius: "4px", overflow: "hidden", background: "#000", lineHeight: 0 }}>
          {children}
        </div>
        <div style={{ height: "6px" }} />
      </div>
      {/* Pescoço */}
      <div style={{ width: "32px", height: "22px", background: "#222", margin: "0 auto" }} />
      {/* Base */}
      <div style={{ width: "90px", height: "6px", background: "linear-gradient(to bottom, #2a2a2a, #181818)", borderRadius: "0 0 5px 5px", margin: "0 auto", boxShadow: "0 3px 10px rgba(0,0,0,0.5)" }} />
    </div>
  );
}

// ─── Slide individual com a sua moldura ──────────────────────────────────────
function Slide({ img, title }: { img: ProjectImage; title: string }) {
  const content = (
    <img
      src={img.url}
      alt={title}
      className="block w-full h-auto object-contain"
      loading="lazy"
      decoding="async"
    />
  );

  if (img.frame === "phone")   return <PhoneFrame>{content}</PhoneFrame>;
  if (img.frame === "desktop") return <DesktopFrame>{content}</DesktopFrame>;
  return <div className="bg-background">{content}</div>;
}

// ─── Carrossel ────────────────────────────────────────────────────────────────
function Carousel({ images, title }: { images: ProjectImage[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-xs text-muted/30 uppercase tracking-widest">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/car">
      {/* Slides — empilhados, só o atual visível */}
      <div className="relative w-full h-full">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 overflow-hidden
              ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <Slide img={img} title={title} />
          </div>
        ))}
      </div>

      {/* Setas */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black p-2 opacity-0 group-hover/car:opacity-100 transition-all"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black p-2 opacity-0 group-hover/car:opacity-100 transition-all"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? "bg-white w-5" : "bg-white/40 w-1.5"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface Props { getCldUrl: (name: string) => string; }

export default function PortfolioSection({ getCldUrl }: Props) {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.projects?.length) setProjects(d.projects); })
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
          const images = getImages(project).map((img) => {
            // Fallback para imagens legadas sem URL completa
            if (!img.url.startsWith("http")) return { ...img, url: getCldUrl(img.url) };
            return img;
          });

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group"
            >
              {/* Card de altura fixa */}
              <div className="relative border border-border hover:border-accent/40 transition-colors duration-300 bg-background overflow-hidden"
                style={{ height: "480px" }}>
                <Carousel images={images} title={project.title} />
              </div>

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
