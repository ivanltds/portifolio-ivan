import { motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { scrollToSection } from "../utils/scroll";
import { useSiteContent } from "../context/SiteContentContext";
import { trackCtaClick, trackWhatsAppClick } from "../utils/analytics";

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
  const { content } = useSiteContent();
  const h = content.hero;
  const footer = content.footer;

  const photoSrc = h.photoUrl.startsWith("http") ? h.photoUrl : getCldUrl(h.photoUrl);

  return (
    <section className="relative px-6 lg:px-16 py-20 lg:py-32 border-b border-border">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_400px] gap-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          <motion.span variants={itemVariants} className="inline-block text-accent font-mono text-xs uppercase tracking-[4px] mb-6">
            {h.label}
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] lg:leading-[0.82] font-extrabold tracking-[-0.05em] mb-10 text-balance whitespace-pre-line"
          >
            {h.headline.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br className="hidden sm:block" />}{line}{" "}</span>
            ))}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl lg:text-3xl text-muted max-w-2xl font-light leading-snug mb-4">
            {h.subtitle}
          </motion.p>
          <motion.p variants={itemVariants} className="text-base lg:text-lg text-foreground max-w-xl font-medium leading-relaxed mb-12">
            {h.actionableText}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button
              onClick={() => { trackCtaClick("hero"); scrollToSection("diagnostico"); }}
              className="bg-accent text-white px-8 py-5 text-sm font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20"
            >
              {h.ctaPrimary} <ArrowRight size={18} />
            </button>
            <a
              href={`https://wa.me/${footer.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("hero")}
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
              src={photoSrc}
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
      </div>
    </section>
  );
}
