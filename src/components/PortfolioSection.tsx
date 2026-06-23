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

// ─── iPhone 17 Pro Max ───────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  // Titânio natural — gradiente metálico multidireção
  const titanium = "linear-gradient(160deg, #7a7a7a 0%, #5c5c5c 18%, #3e3e3e 40%, #4a4a4a 60%, #606060 80%, #4e4e4e 100%)";
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "16px 0 20px" }}>
      <div style={{ position: "relative", width: "206px" }}>

        {/* Anel externo de titânio */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "52px",
          background: titanium,
          boxShadow: [
            "0 30px 80px rgba(0,0,0,0.75)",
            "0 0 0 0.5px rgba(255,255,255,0.12)",
            "inset 0 1px 0 rgba(255,255,255,0.18)",
            "inset 0 -1px 0 rgba(0,0,0,0.4)",
          ].join(", "),
        }} />

        {/* Corpo interno (preto, bezel fino) */}
        <div style={{
          position: "relative",
          margin: "5px",
          background: "#0a0a0a",
          borderRadius: "47px",
          padding: "10px 6px 14px",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}>
          {/* Dynamic Island */}
          <div style={{
            width: "80px", height: "28px",
            background: "#000",
            borderRadius: "20px",
            margin: "0 auto 6px",
            boxShadow: "0 0 0 1.5px #1a1a1a, inset 0 0 8px rgba(0,0,0,0.8)",
          }} />
          {/* Tela */}
          <div style={{
            borderRadius: "36px", overflow: "hidden",
            background: "#000", lineHeight: 0,
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)",
          }}>
            {children}
          </div>
          {/* Home indicator */}
          <div style={{
            width: "56px", height: "4px",
            background: "rgba(255,255,255,0.22)",
            borderRadius: "4px",
            margin: "10px auto 0",
          }} />
        </div>

        {/* Action button (esquerda, topo) */}
        <div style={{
          position: "absolute", left: "-3.5px", top: "72px",
          width: "3px", height: "20px",
          background: "linear-gradient(to right, #555, #3a3a3a)",
          borderRadius: "2px 0 0 2px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        }} />
        {/* Volume up */}
        <div style={{
          position: "absolute", left: "-3.5px", top: "106px",
          width: "3px", height: "36px",
          background: "linear-gradient(to right, #555, #3a3a3a)",
          borderRadius: "2px 0 0 2px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        }} />
        {/* Volume down */}
        <div style={{
          position: "absolute", left: "-3.5px", top: "150px",
          width: "3px", height: "36px",
          background: "linear-gradient(to right, #555, #3a3a3a)",
          borderRadius: "2px 0 0 2px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        }} />
        {/* Power button */}
        <div style={{
          position: "absolute", right: "-3.5px", top: "110px",
          width: "3px", height: "56px",
          background: "linear-gradient(to left, #555, #3a3a3a)",
          borderRadius: "0 2px 2px 0",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        }} />
      </div>
    </div>
  );
}

// ─── Apple Studio Display (monitor Mac) ──────────────────────────────────────
function DesktopFrame({ children }: { children: React.ReactNode }) {
  const silver = "linear-gradient(175deg, #e8e8e8 0%, #d0d0d0 40%, #c4c4c4 60%, #d8d8d8 100%)";
  const silverDark = "linear-gradient(to bottom, #c8c8c8, #b0b0b0)";
  return (
    <div style={{ padding: "16px 4px 0" }}>
      {/* Monitor */}
      <div style={{
        position: "relative",
        background: silver,
        borderRadius: "14px 14px 6px 6px",
        padding: "8px 8px 16px",
        boxShadow: [
          "0 0 0 0.5px rgba(0,0,0,0.25)",
          "0 20px 60px rgba(0,0,0,0.55)",
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          "inset 0 -1px 0 rgba(0,0,0,0.1)",
        ].join(", "),
      }}>
        {/* FaceTime camera */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "12px", marginBottom: "5px" }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #555 0%, #222 60%, #111 100%)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3), inset 0 0 2px rgba(255,255,255,0.15)",
          }} />
        </div>
        {/* Tela */}
        <div style={{
          borderRadius: "3px", overflow: "hidden",
          background: "#000", lineHeight: 0,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
        }}>
          {children}
        </div>
        {/* Chin / logo Apple */}
        <div style={{ height: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="12" viewBox="0 0 14 17" fill="none">
            <path d="M13.2 13.1c-.3.6-.6 1.2-1 1.7-.5.7-.9 1.2-1.3 1.4-.5.3-1.1.4-1.7.4-.4 0-1-.1-1.6-.4-.6-.3-1.2-.4-1.7-.4-.5 0-1.1.1-1.7.4-.6.3-1.1.4-1.5.4-.6 0-1.1-.1-1.6-.4-.5-.3-.9-.8-1.3-1.5C.2 14 0 13.4 0 12.7c0-.8.2-1.6.6-2.2.3-.5.8-1 1.4-1.3.6-.3 1.2-.5 1.9-.5.5 0 1.1.2 1.8.5.7.3 1.1.5 1.3.5.2 0 .7-.2 1.4-.5.8-.3 1.4-.5 1.9-.4.7 0 1.3.2 1.8.5.3.2.6.4.8.7-.6.4-1.1.9-1.3 1.6-.2.6-.1 1.3.2 2zM9.7.2C9.2.7 8.5 1.1 7.7 1.3 7 1.4 6.3 1.3 5.7 1.1c0-.1 0-.2 0-.3 0-.8.3-1.5.8-2C7.1.3 7.8 0 8.5 0c.1 0 .1 0 .2 0 .3.1.6.1.9.2z" fill="rgba(0,0,0,0.35)"/>
          </svg>
        </div>
      </div>

      {/* Pescoço do suporte */}
      <div style={{
        width: "28px", height: "30px",
        background: silverDark,
        margin: "0 auto",
        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        boxShadow: "inset 1px 0 0 rgba(255,255,255,0.4)",
      }} />
      {/* Base oval */}
      <div style={{
        width: "110px", height: "10px",
        background: silverDark,
        borderRadius: "50%",
        margin: "0 auto",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
      }} />
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
              <div className="relative bg-background overflow-hidden"
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
