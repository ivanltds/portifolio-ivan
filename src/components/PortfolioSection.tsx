import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  image: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Coyotes Basquete",
    desc: "Landing page estratégica para time de basquete. Gestão de inscrições em eventos, treinos e captação de novos atletas.",
    link: "https://basquete-coyotes.vercel.app/",
    tags: ["React", "Vite", "Tailwind", "Gestão de Eventos"],
    image: "portfolio-coyotes.png",
  },
  {
    id: "2",
    title: "Invite Event (SaaS)",
    desc: "Plataforma SaaS para gestão de casamentos e eventos sociais, com convites personalizados e controle de convidados.",
    link: "https://invite-event-beryl.vercel.app/",
    tags: ["SaaS", "Next.js", "Arquitetura", "UX Design"],
    image: "portfolio-invite.png",
  },
  {
    id: "3",
    title: "Agile All View AI",
    desc: "Ferramenta de análise de dados e dashboards de métricas de eficiência (Azure DevOps). Extrai dados e gera insights relevantes via IA.",
    link: "https://agile-all-view-ai-plkv.vercel.app/",
    tags: ["AI Metrics", "Azure DevOps", "Data Viz", "Agile"],
    image: "portfolio-metrics.png",
  },
];

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
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="group relative"
          >
            <div className="relative aspect-video overflow-hidden border border-border transition-all duration-700">
              <img
                src={getCldUrl(project.image)}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.title}/800/450`;
                }}
              />
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold tracking-tight uppercase">{project.title}</h3>
                <a href={project.link} target="_blank" rel="noreferrer" className="p-3 border border-border hover:bg-accent hover:text-white transition-all">
                  <ExternalLink size={18} />
                </a>
              </div>
              <p className="text-sm text-muted leading-relaxed font-light">{project.desc}</p>
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pt-2 -mx-1 px-1">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-bold font-sans border border-border px-3 py-1 uppercase text-muted group-hover:text-accent group-hover:border-accent transition-colors tracking-tight whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
