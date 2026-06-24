import { X } from "lucide-react";
import { useEffect } from "react";

interface Props { onClose: () => void; }

export default function PrivacyModal({ onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-background border border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0">
          <div>
            <span className="text-[10px] font-mono text-muted uppercase tracking-[4px] block mb-1">Legal</span>
            <h2 className="text-lg font-extrabold tracking-tighter">Política de Privacidade</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-accent transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-8 py-6 space-y-6 text-sm text-muted leading-relaxed">
          <p className="text-[10px] uppercase tracking-widest text-muted/60">Última atualização: Junho de 2026</p>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">1. Quem somos</h3>
            <p>
              Este site é operado por <strong className="text-foreground">Ivan Souza — LTDS Consultoria</strong>. Nos comprometemos a proteger
              a privacidade de todos os visitantes e a tratar seus dados com responsabilidade e transparência.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">2. Dados coletados</h3>
            <p>Coletamos apenas os dados que você fornece voluntariamente:</p>
            <ul className="space-y-1 pl-4 list-disc list-outside text-muted">
              <li><strong className="text-foreground">Formulário de contato:</strong> nome completo, e-mail e descrição do seu desafio.</li>
              <li><strong className="text-foreground">Cookies técnicos:</strong> identificadores de sessão para funcionamento básico do site.</li>
            </ul>
            <p>Não coletamos dados de navegação, não usamos rastreamento de terceiros e não vendemos dados para anunciantes.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">3. Como usamos seus dados</h3>
            <ul className="space-y-1 pl-4 list-disc list-outside text-muted">
              <li>Responder ao seu contato e fornecer a consultoria solicitada.</li>
              <li>Nenhuma finalidade de marketing sem seu consentimento explícito.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">4. Cookies</h3>
            <p>Utilizamos apenas cookies estritamente necessários para o funcionamento do site (preferências de consentimento). Não utilizamos cookies de rastreamento ou publicidade.</p>
            <div className="border border-border p-4 space-y-2">
              <div className="grid grid-cols-3 gap-4 text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border pb-2">
                <span>Cookie</span><span>Finalidade</span><span>Duração</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <span className="font-mono text-accent">cookie_consent</span>
                <span>Salva sua preferência de cookies</span>
                <span>1 ano</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">5. Seus direitos (LGPD)</h3>
            <p>Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
            <ul className="space-y-1 pl-4 list-disc list-outside text-muted">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Solicitar acesso, correção ou exclusão dos seus dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">6. Compartilhamento</h3>
            <p>Seus dados <strong className="text-foreground">não são compartilhados</strong> com terceiros, exceto quando estritamente necessário para operação do serviço (ex: provedor de e-mail para envio de mensagens).</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">7. Contato</h3>
            <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato:</p>
            <a href="mailto:ivanltds@gmail.com" className="text-accent hover:underline font-bold">ivanltds@gmail.com</a>
          </section>
        </div>

        <div className="shrink-0 px-8 py-4 border-t border-border">
          <button onClick={onClose} className="w-full py-3 bg-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
