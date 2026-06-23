import { Linkedin } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 hidden lg:flex border-r border-border flex-col items-center justify-between py-10 z-50 bg-background">
      <div className="font-extrabold text-2xl tracking-tighter">IS.</div>
      <div className="rail-text text-[9px] text-muted font-mono tracking-[4px] uppercase whitespace-nowrap opacity-50">
        ESTRATÉGIA & EXECUÇÃO TÉCNICA
      </div>
      <div className="flex flex-col gap-6 items-center">
        <a
          href="https://www.linkedin.com/in/ivan-ltds/"
          target="_blank"
          rel="noreferrer"
          className="text-muted hover:text-accent transition-colors"
        >
          <Linkedin size={18} />
        </a>
        <div className="w-[1px] h-12 bg-border"></div>
      </div>
    </aside>
  );
}
