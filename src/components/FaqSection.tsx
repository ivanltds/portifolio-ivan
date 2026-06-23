import { CheckCircle2 } from "lucide-react";

const faqs = [
  { q: "Você consegue entender meu contexto de negócio?", a: "Absolutamente. Minha senioridade vem de ambientes de risco onde tecnologia é custo se não gerar ROI claro." },
  { q: "Você foca em gestão ou em código?", a: "Sou um consultor híbrido. Desenho a estratégia de delivery e, se necessário, desço ao nível do backend para garantir a arquitetura." },
  { q: "Como a IA entra na sua consultoria?", a: "Uso IA para acelerar a produtividade do seu time e criar automações de processos que hoje são manuais e lentos." },
  { q: "Vale a pena para empresas em estágio inicial?", a: "Sim, especialmente se você quer evitar o 'débito técnico' e o 'caos operacional' que matam scale-ups cedo demais." },
];

export default function FaqSection() {
  return (
    <section id="faq" className="px-6 lg:px-16 py-32 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-mono text-muted uppercase tracking-[4px] mb-8 block">04 — Dúvidas Frequentes</span>
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none mb-6">Clarificando a parceria.</h2>
          <p className="text-xl text-muted font-light italic">Respostas diretas e pragmáticas para os desafios que você enfrenta.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {faqs.map((faq, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
              <CheckCircle2 size={16} /> {faq.q}
            </h4>
            <p className="text-sm text-muted leading-relaxed border-l border-border pl-6">{faq.a}</p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
