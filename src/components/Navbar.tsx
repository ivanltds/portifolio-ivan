import { scrollToSection } from "../utils/scroll";

export default function Navbar() {
  return (
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
        onClick={() => scrollToSection("diagnostico")}
        className="hidden sm:flex text-xs font-bold uppercase tracking-widest border border-accent bg-accent/5 hover:bg-accent hover:text-white px-6 py-2 transition-all"
      >
        Conversa de 20 min
      </button>
    </header>
  );
}
