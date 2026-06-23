import { motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { scrollToSection } from "../utils/scroll";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Props {
  getCldUrl: (name: string) => string;
}

export default function HeroSection({ getCldUrl }: Props) {
  return (
    <section className="relative px-6 lg:px-16 py-20 lg:py-32 grid lg:grid-cols-[1fr_400px] gap-16 border-b border-border">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <motion.span variants={itemVariants} className="inline-block text-accent font-mono text-xs uppercase tracking-[4px] mb-6">
          Consultoria Estratégica Premium
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] lg:leading-[0.82] font-extrabold tracking-[-0.05em] mb-10 text-balance"
        >
          ENTREGANDO DE<br className="hidden sm:block" />
          FORMA <span className="text-accent underline decoration-2 underline-offset-8">PREVISÍVEL.</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl lg:text-3xl text-muted max-w-2xl font-light leading-snug mb-12">
          10 anos transformando complexidade técnica em eficiência operacional para empresas que não aceitam gargalos na execução.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <button
            onClick={() => scrollToSection("diagnostico")}
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
        <div className="relative aspect-[4/5] overflow-hidden border border-border transition-all duration-700 group">
          <img
            src={getCldUrl("ivan-hero.jpg")}
            alt="Ivan Souza"
            referrerPolicy="no-referrer"
            className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent">
            <div className="text-2xl font-black tracking-tighter">IVAN SOUZA</div>
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">Desenvolvedor & Agile Master</div>
          </div>
        </div>
      </aside>
    </section>
  );
}
