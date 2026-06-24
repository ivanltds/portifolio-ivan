import { useState } from "react";
import PrivacyModal from "./PrivacyModal";
import { grantConsent, denyConsent } from "../utils/analytics";

const CONSENT_KEY = "cookie_consent";

export type ConsentValue = "accepted" | "rejected" | null;

export function getConsent(): ConsentValue {
  try { return localStorage.getItem(CONSENT_KEY) as ConsentValue; } catch { return null; }
}

// Restaura consentimento salvo ao carregar a página (chamado em main.tsx)
export function restoreConsent() {
  const saved = getConsent();
  if (saved === "accepted") grantConsent();
  else if (saved === "rejected") denyConsent();
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentValue>(getConsent);
  const [showPolicy, setShowPolicy] = useState(false);

  if (consent !== null) return showPolicy ? <PrivacyModal onClose={() => setShowPolicy(false)} /> : null;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    grantConsent();
    setConsent("accepted");
  };
  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    denyConsent();
    setConsent("rejected");
  };

  return (
    <>
      {showPolicy && <PrivacyModal onClose={() => setShowPolicy(false)} />}

      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-background/95 backdrop-blur-md px-6 lg:px-16 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex-1">
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Usamos cookies estritamente necessários para o funcionamento do site.{" "}
              <button onClick={() => setShowPolicy(true)} className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                Política de Privacidade
              </button>
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={reject}
              className="px-5 py-2 border border-border text-xs font-bold uppercase tracking-widest text-muted hover:border-muted hover:text-foreground transition-all"
            >
              Recusar
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 bg-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
