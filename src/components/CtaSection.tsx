import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { scrollToSection } from "../utils/scroll";

export default function CtaSection() {
  return (
    <section className="px-6 lg:px-16 py-20 lg:py-32 bg-surface text-center overflow-hidden border-b border-border">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-6xl lg:text-[160px] font-black tracking-[-0.05em] leading-[0.75] mb-8 lg:mb-16 opacity-10 uppercase select-none">
          RESULTS OVER<br />THEORY
        </h2>
        <h3 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tighter mb-12">
          PRONTO PARA O <span className="text-accent italic">PRÓXIMO NÍVEL?</span>
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button onClick={() => scrollToSection("diagnostico")} className="bg-accent text-white px-12 py-6 text-sm font-bold uppercase tracking-widest shadow-xl shadow-accent/40 hover:scale-105 transition-all">
            Marcar Consultoria
          </button>
          <a href="https://wa.me/5575998723992" target="_blank" rel="noreferrer" className="border border-border hover:border-muted px-12 py-6 text-sm font-bold uppercase tracking-widest transition-all inline-flex items-center justify-center gap-3 group">
            <MessageCircle size={18} className="group-hover:text-accent transition-colors" /> Iniciar WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
