import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: string[];
  image?: string; // legado
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Coyotes Basquete",
    desc: "Landing page estratégica para time de basquete. Gestão de inscrições em eventos, treinos e captação de novos atletas.",
    link: "https://basquete-coyotes.vercel.app/",
    tags: ["React", "Vite", "Tailwind", "Gestão de Eventos"],
    images: [],
    image: "portfolio-coyotes.png",
  },
  {
    id: "2",
    title: "Invite Event (SaaS)",
    desc: "Plataforma SaaS para gestão de casamentos e eventos sociais, com convites personalizados e controle de convidados.",
    link: "https://invite-event-beryl.vercel.app/",
    tags: ["SaaS", "Next.js", "Arquitetura", "UX Design"],
    images: [],
    image: "portfolio-invite.png",
  },
];

function getImages(p: Project): string[] {
  if (p.images?.length > 0) return p.images;
  if (p.image?.startsWith("http")) return [p.image];
  return [];
}

// ─── Carrossel por projeto ─────────────────────────────────────────────────────
function Carousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Auto-play a cada 4s
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, images.length]);

  if (images.length === 0) {
    return (
      <div className="h-48 bg-surface border border-border flex items-center justify-center">
        <span className="text-xs text-muted/30 uppercase tracking-widest">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border border-border group bg-[#0a0a0a]" style={{ minHeight: "200px", maxHeight: "520px" }}>
      {/* Slides */}
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${title} — ${i + 1}`}
          className={`block w-full h-auto max-h-[520px] object-contain transition-all duration-700
            ${i === current ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          loading="lazy"
          decoding="async"
        />
      ))}

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Setas — só com múltiplas imagens */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-2 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-2 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={16} />
          </button>

          {/* Pontos indicadores */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface Props {
  getCldUrl: (name: string) => string;
}

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
          // Fallback legado: nome de arquivo → getCldUrl
          const resolvedImages = images.length > 0
            ? images
            : project.image && !project.image.startsWith("http")
              ? [getCldUrl(project.image)]
              : [];

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative"
            >
              <Carousel images={resolvedImages} title={project.title} />

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
