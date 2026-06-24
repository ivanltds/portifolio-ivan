import { useState, useEffect } from "react";
import { GraduationCap, Trophy, Heart } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

interface Props {
  getCldUrl: (name: string) => string;
}

function calcAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years > 0) {
    return `${years} ${years === 1 ? "ano" : "anos"}${months > 0 ? ` e ${months} ${months === 1 ? "mês" : "meses"}` : ""}`;
  }
  return `${months} ${months === 1 ? "mês" : "meses"}`;
}

// Grid adaptativo: 4→2col, 5-6→3col, 7-8→4col, 9-10→5col
function certGridCols(n: number): string {
  if (n <= 4) return "grid-cols-2";
  if (n <= 6) return "grid-cols-3";
  if (n <= 8) return "grid-cols-4";
  return "grid-cols-5";
}

export default function AboutSection({ getCldUrl }: Props) {
  const { content } = useSiteContent();
  const ab = content.about;
  const fm = content.formacao;
  const [childAge, setChildAge] = useState("");

  useEffect(() => {
    setChildAge(calcAge(ab.personalCard.birthDate));
  }, [ab.personalCard.birthDate]);

  const photoSrc = ab.photoUrl.startsWith("http") ? ab.photoUrl : getCldUrl(ab.photoUrl);

  return (
    <section id="sobre" className="px-6 lg:px-16 py-20 lg:py-32 border-b border-border bg-surface/[0.03]">
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">

        {/* ── O Consultor ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs font-mono text-muted uppercase tracking-[4px] block">{ab.label}</span>
              <h2 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-none">
                {ab.title} <span className="text-accent underline decoration-4 underline-offset-8">{ab.titleAccent}</span>
              </h2>
            </div>
            <div className="space-y-6 max-w-xl">
              <p className="text-2xl text-foreground font-medium leading-tight">{ab.summary}</p>
              <p className="text-sm text-muted leading-relaxed font-light">{ab.paragraph1}</p>
              <p className="text-sm text-muted leading-relaxed font-light">{ab.paragraph2}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2 row-span-2 border border-border overflow-hidden transition-all duration-700 min-h-[400px]">
              <img src={photoSrc} alt="Ivan Souza" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4 col-span-2 lg:col-span-1 grid sm:grid-cols-3 lg:block gap-4 sm:space-y-0 lg:space-y-4">
              <div className="h-40 bg-accent p-8 flex flex-col justify-center text-white">
                <span className="text-4xl font-black leading-none">{ab.statCard.value}</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80 mt-1">{ab.statCard.label}</span>
              </div>
              <div className="h-40 border border-border bg-background p-8 flex flex-col justify-center group overflow-hidden relative">
                <Trophy className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-[10px] leading-tight uppercase tracking-widest font-black">{ab.roleCard.title}</span>
                <span className="text-[9px] text-muted uppercase font-bold mt-1">{ab.roleCard.subtitle}</span>
              </div>
              <div className="h-40 border border-border bg-surface p-8 flex flex-col justify-center group">
                <Heart className="text-accent mb-2 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-[10px] leading-tight uppercase tracking-widest font-black">{ab.personalCard.title}</span>
                <span className="text-[9px] text-muted uppercase font-bold mt-1">{childAge} hoje</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Formações & Certificações ── */}
        <div className="space-y-8 lg:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
            <div className="space-y-2">
              <span className="text-xs font-mono text-accent uppercase tracking-[4px]">{fm.label}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase italic">{fm.title}</h3>
            </div>
            <div className="text-[10px] text-muted uppercase tracking-widest font-medium max-w-xs md:text-right">
              {fm.summary}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Jornada Acadêmica */}
            <div className="p-6 sm:p-8 border border-border bg-background space-y-8 lg:col-span-1">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-full">
                  <GraduationCap className="text-accent" size={20} />
                </div>
                <h4 className="font-black text-sm uppercase tracking-widest">Jornada Acadêmica</h4>
              </div>
              <div className="space-y-6">
                {fm.academicJourney.map((entry) => (
                  <div key={entry.id} className="space-y-2">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">{entry.institution}</p>
                    <p className="text-xs font-medium">{entry.course}</p>
                    <div className="text-[10px] text-muted uppercase">{entry.period}</div>
                  </div>
                ))}
                {fm.specializations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Especializações</p>
                    <ul className="text-xs space-y-3 font-medium text-foreground/80">
                      {fm.specializations.map((s, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Certificações */}
            <div className={`lg:col-span-2 grid ${certGridCols(fm.certifications.length)} gap-4`}>
              {fm.certifications.map((cert) => {
                const imgSrc = cert.imageUrl.startsWith("http") ? cert.imageUrl : getCldUrl(cert.imageUrl);
                return (
                  <div key={cert.id} className="flex gap-4 p-6 border border-border bg-background transition-all hover:border-accent group items-center">
                    <div className="w-16 h-16 shrink-0 overflow-hidden bg-white p-1 border border-border/50 transition-transform duration-500 group-hover:scale-105">
                      <img
                        src={imgSrc}
                        alt={cert.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${cert.name}/150/150`;
                        }}
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="text-[10px] font-black text-accent uppercase tracking-[2px] leading-tight group-hover:text-foreground transition-colors truncate">{cert.name}</div>
                      <div className="text-[9px] text-muted uppercase tracking-widest font-bold">{cert.issuer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
