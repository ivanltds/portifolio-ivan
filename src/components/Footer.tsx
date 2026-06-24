import { Linkedin, Mail, MessageCircle, Settings } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function Footer() {
  const { content } = useSiteContent();
  const ft = content.footer;

  return (
    <>
      <footer className="px-6 lg:px-16 py-20 bg-background flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="font-black text-4xl tracking-tighter">{ft.name}</div>
          <p className="text-xs text-muted leading-relaxed uppercase tracking-[1.5px] font-medium whitespace-pre-line">
            {ft.tagline}
          </p>
          <div className="flex gap-4">
            <a href={ft.linkedinUrl} target="_blank" rel="noreferrer" className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${ft.email}`} className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
              <Mail size={20} />
            </a>
            <a href={`https://wa.me/${ft.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-12 h-12 border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-muted">
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
              <li className="italic">
                <a href={`mailto:${ft.email}`} className="hover:text-foreground transition-colors">{ft.email}</a>
              </li>
              <li>
                <a href={`https://wa.me/${ft.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{ft.phone}</a>
              </li>
              <li className="text-[10px] opacity-60">{ft.location}</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="px-6 lg:px-16 py-8 border-t border-border bg-background flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-muted font-bold uppercase tracking-[2px]">
        <span>{ft.copyright}</span>
        <span className="opacity-50 tracking-[4px]">Desenvolvedor & Agile Master.</span>
        <a href="/admin" className="opacity-20 hover:opacity-60 transition-opacity text-muted" title="Admin" aria-label="Painel administrativo">
          <Settings size={13} />
        </a>
      </div>
    </>
  );
}
