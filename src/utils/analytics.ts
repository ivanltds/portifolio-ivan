/**
 * Utilitário de analytics — Google Analytics 4 + Vercel Analytics
 *
 * Eventos rastreados:
 *  - lead_form_submit  → formulário de diagnóstico enviado (lead principal)
 *  - generate_lead     → alias GA4 padrão (conversão)
 *  - cta_click         → clique em CTA primário
 *  - whatsapp_click    → clique no botão WhatsApp
 *  - project_view      → clique em "ver projeto" no portfólio
 */

import { track as vaTrack } from "@vercel/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

function sendGA(eventName: string, params: EventParams = {}) {
  window.gtag?.("event", eventName, params);
}

function track(eventName: string, params: EventParams = {}) {
  sendGA(eventName, params);
  vaTrack(eventName, params);
}

// ─── Consent mode (GA4) ─────────────────────────────────────────────────────

/** Aceitar cookies — libera GA4 e analytics */
export function grantConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
}

/** Rejeitar cookies — mantém GA4 em modo restrito */
export function denyConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
  });
}

// ─── Eventos de lead ─────────────────────────────────────────────────────────

/** Formulário de diagnóstico enviado com sucesso */
export function trackLeadSubmit(email: string) {
  const domain = email.split("@")[1] || "unknown";
  track("lead_form_submit", { email_domain: domain });
  sendGA("generate_lead", { currency: "BRL", value: 1 }); // conversão GA4 padrão
}

/** Clique em CTA primário (agendar conversa) */
export function trackCtaClick(location: string) {
  track("cta_click", { cta_location: location });
}

/** Clique no WhatsApp */
export function trackWhatsAppClick(location: string) {
  track("whatsapp_click", { click_location: location });
}

/** Clique em "ver projeto" no portfólio */
export function trackProjectView(projectTitle: string) {
  track("project_view", { project_title: projectTitle });
}
