import { useState, useEffect } from "react";
import { GraduationCap, Trophy, Heart, Mail, MessageCircle } from "lucide-react";

interface Props {
  getCldUrl: (name: string) => string;
}

export default function AboutSection({ getCldUrl }: Props) {
  const [childAge, setChildAge] = useState("");

  useEffect(() => {
    const birthDate = new Date(2025, 3, 17);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) months--;
    if (months < 0) { years--; months += 12; }
    if (years > 0) {
      setChildAge(`${years} ${years === 1 ? "ano" : "anos"}${months > 0 ? ` e ${months} ${months === 1 ? "mês" : "meses"}` : ""}`);
    } else {
      setChildAge(`${months} ${months === 1 ? "mês" : "meses"}`);
    }
  }, []);

  const certs = [
    { name: "PSM I", issuer: "Scrum.org", image: getCldUrl("badge-psm.png") },
    { name: "PSPO I", issuer: "Scrum.org", image: getCldUrl("badge-pspo.png") },
    { name: "OKR Foundation", issuer: "CertiProf", image: getCldUrl("badge-okr.png") },
    { name: "Análise e Desenvolvimento de Sistemas", issuer: "Mackenzie", image: getCldUrl("badge-mackenzie.png") },
  ];

  return (
    <section id="sobre" className="px-6 lg:px-16 py-20 lg:py-32 border-b border-border bg-surface/[0.03]">
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
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
                Construí minha trajetória em consultorias de alta complexidade, operando em ecossistemas de{" "}
                <strong className="text-foreground font-bold italic">Alta Disponibilidade</strong>. Meu histórico inclui a modernização
                de plataformas em grandes players do <strong className="text-foreground font-normal">Setor Financeiro</strong>, Varejo e
                setor Farmacêutico.
              </p>
              <p className="text-sm text-muted leading-relaxed font-light">
                Após consolidar experiência em infraestruturas críticas do{" "}
                <strong className="text-foreground font-bold italic">Mercado de Capitais</strong>, hoje foco meus esforços na{" "}
                <strong className="text-foreground font-bold uppercase tracking-wider">Implementação Estratégica de IA</strong>. Em
                paralelo, alimento meu DNA empreendedor desenvolvendo soluções escaláveis e projetos de impacto social.
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
            <div className="col-span-2 row-span-2 border border-border overflow-hidden transition-all duration-700 min-h-[400px]">
              <img src={getCldUrl("sobre-tech.png")} alt="Technology" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4 col-span-2 lg:col-span-1 grid sm:grid-cols-3 lg:block gap-4 sm:space-y-0 lg:space-y-4">
              <div className="h-40 bg-accent p-8 flex flex-col justify-center text-white">
                <span className="text-4xl font-black leading-none">29</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80 mt-1">Anos de Idade</span>
              </div>
              <div className="h-40 border border-border bg-background p-8 flex flex-col justify-center group overflow-hidden relative">
                <Trophy className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-[10px] leading-tight uppercase tracking-widest font-black">Diretor Social & Atleta</span>
                <span className="text-[9px] text-muted uppercase font-bold mt-1">Coyotes Basketball</span>
                <img src={getCldUrl("portfolio-coyotes.png")} alt="Coyotes" referrerPolicy="no-referrer" className="absolute -right-4 -bottom-4 w-20 opacity-5 group-hover:opacity-10 transition-opacity rotate-12" />
              </div>
              <div className="h-40 border border-border bg-surface p-8 flex flex-col justify-center group">
                <Heart className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-[10px] leading-tight uppercase tracking-widest font-black">Pai do Iuri</span>
                <span className="text-[9px] text-muted uppercase font-bold mt-1">{childAge} hoje</span>
              </div>
            </div>
          </div>
        </div>

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

            <div className="lg:col-span-2 flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto no-scrollbar snap-x px-4 sm:px-0 -mx-4 sm:mx-0">
              {certs.map((cert, i) => (
                <div key={i} className="flex gap-4 p-6 border border-border bg-background transition-all hover:border-accent group items-center shrink-0 w-[280px] sm:w-auto snap-center">
                  <div className="w-16 h-16 shrink-0 overflow-hidden bg-white p-1 border border-border/50 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      referrerPolicy="no-referrer"
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
  );
}
