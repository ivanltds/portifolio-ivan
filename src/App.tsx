/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  ArrowRight, 
  BarChart3, 
  Database,
  Layers, 
  Cpu, 
  Settings, 
  Workflow, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  HelpCircle,
  MessageSquare,
  Zap,
  Code2,
  Linkedin,
  Mail,
  MessageCircle,
  Calendar,
  GraduationCap,
  User,
  CheckCircle2,
  ExternalLink,
  Trophy,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
  const [childAge, setChildAge] = useState("");
  
  useEffect(() => {
    // Nascimento: 17 de Abril de 2025
    const birthDate = new Date(2025, 3, 17); // Mês é 0-indexed (Abril = 3)
    const today = new Date(); // Assume 18 de Abril de 2026 baseado no contexto
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      setChildAge(`${years} ${years === 1 ? 'ano' : 'anos'}${months > 0 ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : ''}`);
    } else {
      setChildAge(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Fixed Sidebar Rail (Desktop) */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 hidden lg:flex border-r border-border flex-col items-center justify-between py-10 z-50 bg-background">
        <div className="font-extrabold text-2xl tracking-tighter">IS.</div>
        <div className="rail-text text-[9px] text-muted font-mono tracking-[4px] uppercase whitespace-nowrap opacity-50">
          ESTRATÉGIA & EXECUÇÃO TÉCNICA
        </div>
        <div className="flex flex-col gap-6 items-center">
          <a href="https://www.linkedin.com/in/ivan-ltds/" target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
            <Linkedin size={18} />
          </a>
          <div className="w-[1px] h-12 bg-border"></div>
        </div>
      </aside>

      <div className="lg:pl-20">
        {/* Navigation */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-16 h-20">
          <div className="lg:hidden font-extrabold text-2xl tracking-tighter">IS.</div>
          <nav className="flex gap-4 sm:gap-6 lg:gap-10 text-[10px] uppercase tracking-widest text-muted font-bold overflow-x-auto no-scrollbar py-2">
            <a href="#experiencia" className="hover:text-accent transition-colors whitespace-nowrap">Experiência</a>
            <a href="#portfolio" className="hover:text-accent transition-colors whitespace-nowrap">Portfólio</a>
            <a href="#servicos" className="hover:text-accent transition-colors whitespace-nowrap">Serviços</a>
            <a href="#sobre" className="hover:text-accent transition-colors whitespace-nowrap">Sobre</a>
            <a href="#faq" className="hover:text-accent transition-colors whitespace-nowrap">Dúvidas</a>
          </nav>
          <button 
            onClick={() => scrollToSection('diagnostico')}
            className="hidden sm:flex text-xs font-bold uppercase tracking-widest border border-accent bg-accent/5 hover:bg-accent hover:text-white px-6 py-2 transition-all"
          >
            Agendar Diagnóstico
          </button>
        </header>

        {/* Hero Section */}
        <section className="relative px-6 lg:px-16 py-20 lg:py-32 grid lg:grid-cols-[1fr_400px] gap-16 border-b border-border">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.span variants={itemVariants} className="inline-block text-accent font-mono text-xs uppercase tracking-[4px] mb-6">
              Consultoria Estratégica Premium
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] lg:leading-[0.82] font-extrabold tracking-[-0.05em] mb-10 text-balance">
              ENTREGANDO DE<br className="hidden sm:block"/>
              FORMA <span className="text-accent underline decoration-2 underline-offset-8">PREVISÍVEL.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl lg:text-3xl text-muted max-w-2xl font-light leading-snug mb-12">
              10 anos transformando complexidade técnica em eficiência operacional para empresas que não aceitam gargalos na execução.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('diagnostico')}
                className="bg-accent text-white px-8 py-5 text-sm font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20"
              >
                Agendar Diagnóstico Gratuito <ArrowRight size={18} />
              </button>
              <a 
                href="https://wa.me/5575998723992" 
                target="_blank" 
                rel="noreferrer"
                className="border border-border hover:border-muted px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </motion.div>
          </motion.div>

          <aside className="hidden lg:flex flex-col justify-center relative">
            <div className="absolute -inset-10 bg-accent/20 blur-[100px] rounded-full opacity-30"></div>
            <div className="relative aspect-[4/5] overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700 group">
              <img 
                src="/ivan-hero.jpg" 
                alt="Ivan Souza" 
                className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent">
                <div className="text-2xl font-black tracking-tighter">IVAN SOUZA</div>
                <div className="text-[10px] uppercase tracking-widest text-accent font-bold">Desenvolvedor & Agile Master</div>
              </div>
            </div>
          </aside>
        </section>

        <section id="sobre" className="px-6 lg:px-16 py-20 lg:py-32 border-b border-border bg-surface/[0.03]">
          <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
            
            {/* Part 1: Hero Intro */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="space-y-8">
                <div className="space-y-6">
                  <span className="text-xs font-mono text-muted uppercase tracking-[4px] block">00 — O Consultor</span>
                  <h2 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-none">
                    Prazer, <span className="text-accent underline decoration-4 underline-offset-8">Ivan.</span>
                  </h2>
                </div>
                <div className="space-y-6 max-w-xl">
                  <p className="text-2xl text-foreground font-medium leading-tight">
                    Trabalho aproximando a tecnologia do negócio há <strong className="text-accent font-bold">10 anos</strong>.
                  </p>
                  <p className="text-sm text-muted leading-relaxed font-light">
                    Construí minha trajetória em consultorias de alta complexidade, operando em ecossistemas de <strong className="text-foreground font-bold italic">Alta Disponibilidade</strong>. Meu histórico inclui a modernização de plataformas em grandes players do <strong className="text-foreground font-normal">Setor Financeiro</strong>, Varejo e setor Farmacêutico.
                  </p>
                  <p className="text-sm text-muted leading-relaxed font-light">
                    Após consolidar experiência em infraestruturas críticas do <strong className="text-foreground font-bold italic">Mercado de Capitais</strong>, hoje foco meus esforços na <strong className="text-foreground font-bold uppercase tracking-wider">Implementação Estratégica de IA</strong>. Em paralelo, alimento meu DNA empreendedor desenvolvendo soluções escaláveis e projetos de impacto social.
                  </p>
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <a href="mailto:ivanltds@gmail.com" className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:text-accent transition-colors group">
                    <Mail size={16} className="group-hover:scale-110 transition-transform" /> ivanltds@gmail.com
                  </a>
                  <a href="https://wa.me/5575998723992" target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:text-accent transition-colors group">
                    <MessageCircle size={16} className="group-hover:scale-110 transition-transform" /> +55 75 99872-3992
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Main Photo - Spans 2 rows on mobile, 2 rows on desktop */}
                <div className="col-span-2 row-span-2 border border-border overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 min-h-[400px]">
                  <img src="/sobre-tech.jpg" alt="Technology" className="w-full h-full object-cover" />
                </div>
                
                {/* Right Column Cards */}
                <div className="space-y-4 col-span-2 lg:col-span-1 grid sm:grid-cols-3 lg:block gap-4 sm:space-y-0 lg:space-y-4">
                  <div className="h-40 bg-accent p-8 flex flex-col justify-center text-white">
                    <span className="text-4xl font-black leading-none">29</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-80 mt-1">Anos de Idade</span>
                  </div>
                  
                  <div className="h-40 border border-border bg-background p-8 flex flex-col justify-center group overflow-hidden relative">
                    <Trophy className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-[10px] leading-tight uppercase tracking-widest font-black">Diretor Social & Atleta</span>
                    <span className="text-[9px] text-muted uppercase font-bold mt-1">Coyotes Basketball</span>
                    <img src="/portfolio-coyotes.jpg" alt="Coyotes" className="absolute -right-4 -bottom-4 w-20 opacity-5 group-hover:opacity-10 transition-opacity rotate-12" />
                  </div>

                  <div className="h-40 border border-border bg-surface p-8 flex flex-col justify-center group">
                    <Heart className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-[10px] leading-tight uppercase tracking-widest font-black">Pai do Iuri</span>
                    <span className="text-[9px] text-muted uppercase font-bold mt-1">{childAge} hoje</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 2: Credentials Grid */}
            <div className="space-y-8 lg:space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-accent uppercase tracking-[4px]">Proof of Work</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase italic">Formação & Certificações</h3>
                </div>
                <div className="text-[10px] text-muted uppercase tracking-widest font-medium max-w-xs md:text-right">
                  Comprometimento com a excelência técnica e metodologias ágeis de mercado.
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Academic Card */}
                <div className="p-6 sm:p-8 border border-border bg-background space-y-8 lg:col-span-1">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-full">
                      <GraduationCap className="text-accent" size={20} />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-widest">Jornada Acadêmica</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Mackenzie</p>
                      <p className="text-xs font-medium">Análise e Desenv. de Sistemas</p>
                      <div className="text-[10px] text-muted uppercase">2017 — 2019</div>
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-border/50">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Especializações</p>
                      <ul className="text-xs space-y-3 font-medium text-foreground/80">
                        <li className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span>UX/UI Design — PUC</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span>Gestão de Projetos — USP</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Badges Grid */}
                <div className="lg:col-span-2 flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto no-scrollbar snap-x px-4 sm:px-0 -mx-4 sm:mx-0">
                  {[
                    { name: "PSM I", issuer: "Scrum.org", image: "/badge-psm.jpg" },
                    { name: "PSPO I", issuer: "Scrum.org", image: "/badge-pspo.jpg" },
                    { name: "OKR Foundation", issuer: "CertiProf", image: "/badge-okr.jpg" },
                    { name: "Análise e Desenvolvimento de Sistemas", issuer: "Mackenzie", image: "/badge-mackenzie.jpg" }
                  ].map((cert, i) => (
                    <div key={i} className="flex gap-4 p-6 border border-border bg-background transition-all hover:border-accent group items-center shrink-0 w-[280px] sm:w-auto snap-center">
                      <div className="w-16 h-16 shrink-0 overflow-hidden bg-white p-1 border border-border/50 transition-transform duration-500 group-hover:scale-105">
                        <img 
                          src={cert.image} 
                          alt={cert.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${cert.name}/150/150`;
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-accent uppercase tracking-[2px] leading-tight group-hover:text-foreground transition-colors">{cert.name}</div>
                        <div className="text-[9px] text-muted uppercase tracking-widest font-bold">{cert.issuer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Pain (The Gap) */}
        <section id="experiencia" className="px-6 lg:px-16 py-20 lg:py-24 bg-surface/20">
          <div className="max-w-4xl">
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">01 — O Contexto</span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tighter leading-tight mb-12">
              Sua operação tecnológica trava na hora de escalar?
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <p className="text-lg text-muted leading-relaxed">
                A maioria das empresas enfrenta o mesmo gargalo: falta de previsibilidade, retrabalho constante e uma barreira invisível entre a visão de negócio e a execução técnica.
              </p>
              <div className="space-y-6">
                {[
                  "Gargalos constantes entre squads e áreas",
                  "Arquiteturas frágeis que impedem a evolução",
                  "Processos lentos e falta de visibilidade de dados",
                  "Dificuldade em integrar IA de forma produtiva"
                ].map((item, id) => (
                  <div key={id} className="flex items-start gap-4 p-4 border border-border bg-background/50 hover:border-accent/40 transition-colors">
                    <Zap size={18} className="text-accent shrink-0 mt-1" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
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
            {[
              {
                title: "Coyotes Basquete",
                desc: "Landing page estratégica para time de basquete. Gestão de inscrições em eventos, treinos e captação de novos atletas.",
                link: "https://basquete-coyotes.vercel.app/",
                tags: ["React", "Vite", "Tailwind", "Gestão de Eventos"],
                image: "/portfolio-coyotes.jpg"
              },
              {
                title: "Invite Event (SaaS)",
                desc: "Plataforma SaaS para gestão de casamentos e eventos sociais, com convites personalizados e controle de convidados.",
                link: "https://invite-event-beryl.vercel.app/",
                tags: ["SaaS", "Next.js", "Arquitetura", "UX Design"],
                image: "/portfolio-invite.jpg"
              },
              {
                title: "Agile All View AI",
                desc: "Ferramenta de análise de dados e dashboards de métricas de eficiência (Azure DevOps). Extrai dados e gera insights relevantes via IA.",
                link: "https://agile-all-view-ai-plkv.vercel.app/",
                tags: ["AI Metrics", "Azure DevOps", "Data Viz", "Agile"],
                image: "/portfolio-metrics.jpg"
              }
            ].map((project, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative"
              >
                <div className="relative aspect-video overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
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
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-bold font-sans border border-border px-3 py-1 uppercase text-muted group-hover:text-accent group-hover:border-accent transition-colors tracking-tight whitespace-nowrap">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pillars / Services */}
        <section id="servicos" className="px-6 lg:px-16 py-20 lg:py-32 bg-background relative border-b border-border">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">02 — Serviços</span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">Expertise que gera valor.</h2>
              <p className="text-lg lg:text-xl text-muted font-light">Ofereço soluções sob medida, do desenho estratégico à implementação técnica.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Workflow />,
                title: "Delivery & Gestão",
                desc: "Consultoria em Kanban, Scrum e otimização de fluxo. Transformação de times lentos em máquinas de entrega previsíveis.",
                tags: ["Squads", "Métricas", "Governança"]
              },
              {
                icon: <Database />,
                title: "Arquitetura & Backend",
                desc: "Desenvolvimento robusto com .NET, Java, Node e Python. Microserviços, DDD e foco total em performance e segurança.",
                tags: ["Cloud", "SQL/NoSQL", "DevOps"]
              },
              {
                icon: <Cpu />,
                title: "Engenharia de IA",
                desc: "Uso estratégico de LLMs e automações (n8n, Make) para acelerar design de soluções e produtividade operacional.",
                tags: ["LLMs", "Automatização", "AI Core"]
              },
              {
                icon: <Settings />,
                title: "Automação Industrial",
                desc: "Otimização de processos complexos através de software personalizado que reduz intervenção manual e erro humano.",
                tags: ["Workflow", "Integrações", "Efficiency"]
              },
              {
                icon: <ShieldCheck />,
                title: "Segurança & Escala",
                desc: "Preparação de infraestruturas para picos de tráfego, garantindo disponibilidade e integridade dos dados sob pressão.",
                tags: ["Scaling", "Robustness", "SLA"]
              },
              {
                icon: <TrendingUp />,
                title: "Growth & CRO Tech",
                desc: "Implementação técnica de funis de venda e ferramentas de análise que permitem decisões baseadas em dados reais.",
                tags: ["Analytics", "Data-Driven", "Conversion"]
              }
            ].map((service, idx) => (
              <div key={idx} className="group p-10 bg-surface/50 border border-border hover:border-accent/40 transition-all flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-white transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4 uppercase">{service.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-10">{service.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-bold font-sans border border-border px-3 py-1 uppercase tracking-tight">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mythology / Methodology */}
        <section id="metodo" className="px-6 lg:px-16 py-32 border-b border-border bg-surface/[0.1]">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">03 — O Método</span>
              <h2 className="text-5xl font-extrabold tracking-tighter leading-tight mb-8">
                Como eu transformo <br/>sua operação.
              </h2>
              <p className="text-lg text-muted mb-10 leading-relaxed">
                Meu processo é pragmático e direto. Eu busco a clareza operacional primeiro, estabilizo a base tecnológica e então acelero através de automação e dados.
              </p>
              <button 
                onClick={() => scrollToSection('diagnostico')}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full border border-accent flex items-center justify-center group-hover:bg-accent transition-all">
                  <ArrowRight className="group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-accent transition-colors">Iniciar Diagnóstico</span>
              </button>
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              {[
                { title: "Diagnóstico & Fluxo", step: "01", desc: "Mapeamento de gargalos, análise de métricas (DORA Metrics) e identificação de silos operacionais." },
                { title: "Arquitetura & Base", step: "02", desc: "Refatoração ou estruturação de backend robusto, garantindo que a tecnologia suporte o crescimento planejado." },
                { title: "Escala & Governança", step: "03", desc: "Implementação de frameworks ágeis (Scrum/Kanban) e dashboards de gestão para visibilidade total." },
                { title: "Aceleração com IA", step: "04", desc: "Integração de agentes autônomos e automações de processos para liberar o time para o que realmente importa." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 p-8 border border-border hover:bg-surface/40 transition-all cursor-default bg-background">
                  <span className="font-mono text-accent text-3xl font-black">{item.step}</span>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-6 lg:px-16 py-32 border-b border-border">
          <div className="max-w-3xl mb-20">
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">04 — Dúvidas Frequentes</span>
            <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">Clarificando a parceria.</h2>
            <p className="text-xl text-muted font-light italic">Respostas diretas e pragmáticas para os desafios que você enfrenta.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {[
              { q: "Você consegue entender meu contexto de negócio?", a: "Absolutamente. Minha senioridade vem de ambientes de risco onde tecnologia é custo se não gerar ROI claro." },
              { q: "Você foca em gestão ou em código?", a: "Sou um consultor híbrido. Desenho a estratégia de delivery e, se necessário, desço ao nível do backend para garantir a arquitetura." },
              { q: "Como a IA entra na sua consultoria?", a: "Uso IA para acelerar a produtividade do seu time e criar automações de processos que hoje são manuais e lentos." },
              { q: "Vale a pena para empresas em estágio inicial?", a: "Sim, especialmente se você quer evitar o 'débito técnico' e o 'caos operacional' que matam scale-ups cedo demais." }
            ].map((faq, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
                  <CheckCircle2 size={16} /> {faq.q}
                </h4>
                <p className="text-sm text-muted leading-relaxed border-l border-border pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="diagnostico" className="px-6 lg:px-16 py-20 lg:py-32 bg-background border-b border-border">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">05 — Diagnóstico</span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-10 text-balance">
                Vamos destravar <br/>sua <span className="text-accent underline decoration-4 underline-offset-8">entrega?</span>
              </h2>
              <p className="text-xl text-muted font-light leading-relaxed mb-12 max-w-lg">
                Preencha as informações abaixo. Este diagnóstico é o primeiro passo para transformar caos em previsibilidade.
              </p>
              
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center font-mono text-xs group-hover:border-accent group-hover:text-accent transition-colors">01</div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest block">Análise de Cenário</span>
                    <span className="text-[10px] text-muted uppercase">Entendimento profundo da sua infra e processos.</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center font-mono text-xs group-hover:border-accent group-hover:text-accent transition-colors">02</div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest block">Reunião Estratégica</span>
                    <span className="text-[10px] text-muted uppercase">Definição de objetivos e métricas de sucesso.</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center font-mono text-xs group-hover:border-accent group-hover:text-accent transition-colors">03</div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest block">Plano de Execução</span>
                    <span className="text-[10px] text-muted uppercase">A proposta clara de como chegaremos lá.</span>
                  </div>
                </div>
              </div>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  nome: formData.get('nome'),
                  email: formData.get('email'),
                  desafio: formData.get('desafio'),
                };

                const btn = e.currentTarget.querySelector('button');
                if (btn) btn.disabled = true;
                
                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });

                  if (response.ok) {
                    alert('Diagnóstico solicitado com sucesso! Entrarei em contato em breve.');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    const err = await response.json();
                    alert(`Erro: ${err.error || 'Falha ao enviar'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão. Verifique sua internet.');
                } finally {
                  if (btn) btn.disabled = false;
                }
              }}
              className="bg-surface p-6 sm:p-10 lg:p-14 border border-border space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BarChart3 size={120} />
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Nome Completo</label>
                  <input type="text" name="nome" placeholder="John Doe" required className="w-full bg-transparent border-b border-border py-4 focus:border-accent focus:outline-none transition-colors text-sm font-light" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">E-mail Corporativo</label>
                  <input type="email" name="email" placeholder="john@company.com" required className="w-full bg-transparent border-b border-border py-4 focus:border-accent focus:outline-none transition-colors text-sm font-light" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Qual o maior desafio técnico/operacional hoje?</label>
                <textarea name="desafio" placeholder="Ex: Atrasos constantes, bugs críticos em produção, falta de escala na infra..." rows={4} required className="w-full bg-transparent border border-border p-6 focus:border-accent focus:outline-none transition-colors text-sm font-light resize-none" />
              </div>
              <button 
                type="submit" 
                className="w-full bg-accent text-white py-6 font-bold text-xs uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar Diagnóstico Estratégico
                <ArrowRight size={16} />
              </button>
              <p className="text-[9px] text-center text-muted uppercase tracking-[1.5px] font-bold">O envio agora é automático. Entrarei em contato em até 24h.</p>
            </form>
          </div>
        </section>

        {/* Final CTA Header */}
        <section className="px-6 lg:px-16 py-20 lg:py-32 bg-surface text-center overflow-hidden border-b border-border">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-6xl lg:text-[160px] font-black tracking-[-0.05em] leading-[0.75] mb-8 lg:mb-16 opacity-10 uppercase select-none">
              RESULTS OVER<br/>THEORY
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tighter mb-12">
              PRONTO PARA O <span className="text-accent italic">PRÓXIMO NÍVEL?</span>
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => scrollToSection('diagnostico')}
                className="bg-accent text-white px-12 py-6 text-sm font-bold uppercase tracking-widest shadow-xl shadow-accent/40 hover:scale-105 transition-all"
              >
                Marcar Consultoria
              </button>
              <a 
                href="https://wa.me/5575998723992" 
                target="_blank" 
                rel="noreferrer"
                className="border border-border hover:border-muted px-12 py-6 text-sm font-bold uppercase tracking-widest transition-all inline-flex items-center justify-center gap-3 group"
              >
                <MessageCircle size={18} className="group-hover:text-accent transition-colors" /> Iniciar WhatsApp
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footnotes / Footer */}
        <footer className="px-6 lg:px-16 py-20 bg-background flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="font-black text-4xl tracking-tighter">IVAN SOUZA</div>
            <p className="text-xs text-muted leading-relaxed uppercase tracking-[1.5px] font-medium">
              Estrategista de Delivery & Engenharia de IA. <br/>Acelerando operações tecnológicas com rigor e visão de negócio.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/ivan-ltds/" target="_blank" rel="noreferrer" className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
                <Linkedin size={20} />
              </a>
              <a href="mailto:ivanltds@gmail.com" className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/5575998723992" target="_blank" rel="noreferrer" className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-24 gap-y-12">
            <div className="space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-accent underline decoration-2 underline-offset-4">Navegação</h5>
              <ul className="text-xs space-y-3 text-muted uppercase tracking-[1.5px] font-bold font-mono">
                <li><a href="#experiencia" className="hover:text-foreground">Experiência</a></li>
                <li><a href="#portfolio" className="hover:text-foreground">Portfólio</a></li>
                <li><a href="#servicos" className="hover:text-foreground">Serviços</a></li>
                <li><a href="#sobre" className="hover:text-foreground">Sobre Mim</a></li>
                <li><a href="#diagnostico" className="hover:text-foreground">Diagnóstico</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-accent underline decoration-2 underline-offset-4">Contato</h5>
              <ul className="text-xs space-y-2 text-muted font-bold tracking-tight">
                <li className="flex items-center gap-2 italic">ivanltds@gmail.com</li>
                <li>+55 75 99872-3992</li>
                <li className="text-[10px] opacity-60">Brasil — Global Delivery</li>
              </ul>
            </div>
          </div>
        </footer>
        <div className="px-6 lg:px-16 py-8 border-t border-border bg-background flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-muted font-bold uppercase tracking-[2px]">
          <span>© 2026 Ivan Souza.</span>
          <span className="opacity-50 tracking-[4px]">Desenvolvedor & Agile Master.</span>
        </div>
      </div>
    </div>
  );
}
