// ─── Hero ─────────────────────────────────────────────────────────────────────
export interface HeroContent {
  label: string;
  headline: string;
  subtitle: string;
  actionableText: string;
  ctaPrimary: string;
  photoUrl: string;
}

// ─── O Consultor ──────────────────────────────────────────────────────────────
export interface AboutContent {
  label: string;
  title: string;
  titleAccent: string;
  summary: string;
  paragraph1: string;
  paragraph2: string;
  photoUrl: string;
  statCard: { value: string; label: string };
  roleCard: { title: string; subtitle: string };
  personalCard: { title: string; birthDate: string };
}

// ─── Formações ────────────────────────────────────────────────────────────────
export interface AcademicEntry {
  id: string;
  institution: string;
  course: string;
  period: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
}

export interface FormacaoContent {
  label: string;
  title: string;
  summary: string;
  academicJourney: AcademicEntry[];
  specializations: string[];
  certifications: Certification[]; // 4–10
}

// ─── O Contexto ───────────────────────────────────────────────────────────────
export interface ExperienceContent {
  label: string;
  title: string;
  summary: string;
  paragraph: string;
  painPoints: string[];
}

// ─── Portfólio ────────────────────────────────────────────────────────────────
export interface PortfolioContent {
  label: string;
  title: string;
  summary: string;
}

// ─── Serviços ─────────────────────────────────────────────────────────────────
export interface ServiceCard {
  id: string;
  enabled: boolean;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface ServicesContent {
  label: string;
  title: string;
  summary: string;
  cards: ServiceCard[]; // 8 slots; 3 ou 6 habilitados
}

// ─── O Método ─────────────────────────────────────────────────────────────────
export interface MethodStep {
  id: string;
  step: string;
  title: string;
  desc: string;
}

export interface MethodContent {
  label: string;
  title: string;
  summary: string;
  ctaText: string;
  steps: MethodStep[]; // até 4
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  featured: boolean; // true = aparece na página (máx 4)
}

export interface FaqContent {
  label: string;
  title: string;
  summary: string;
  questions: FaqItem[];
}

// ─── Diagnóstico ──────────────────────────────────────────────────────────────
export interface ContactStep {
  id: string;
  num: string;
  title: string;
  sub: string;
}

export interface ContactContent {
  label: string;
  title: string;
  accentWord: string;
  summary: string;
  ctaText: string;
  contactEmail: string;
  formNote: string;
  steps: ContactStep[];
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
export interface CtaContent {
  backgroundText: string;
  title: string;
  accentPart: string;
  ctaPrimary: string;
  ctaWhatsApp: string;
}

// ─── Rodapé ───────────────────────────────────────────────────────────────────
export interface FooterContent {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  linkedinUrl: string;
  location: string;
  copyright: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  formacao: FormacaoContent;
  experience: ExperienceContent;
  portfolio: PortfolioContent;
  services: ServicesContent;
  method: MethodContent;
  faq: FaqContent;
  contact: ContactContent;
  cta: CtaContent;
  footer: FooterContent;
}
