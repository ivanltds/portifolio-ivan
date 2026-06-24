# Ivan Souza — Portfólio Profissional

Site de portfólio e consultoria da **LTDS**, com painel admin completo para gestão de conteúdo e projetos.

**Live:** [portifolio-ivan.vercel.app](https://portifolio-ivan.vercel.app)

---

## Stack

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- **Backend:** Express (dev) / Vercel Serverless Functions (prod)
- **Banco de dados:** Upstash Redis
- **Imagens:** Cloudinary
- **E-mail:** Resend
- **Analytics:** Google Analytics 4 (Consent Mode v2) + Vercel Analytics + Microsoft Clarity
- **Monitoramento:** Sentry
- **Anti-spam:** Cloudflare Turnstile
- **Deploy:** Vercel

---

## Estrutura do projeto

```
├── api/                        # Serverless functions (Vercel) / rotas Express (dev)
│   ├── contact.ts              # Envio de e-mail via Resend + validação Turnstile
│   ├── content.ts              # Conteúdo público do site (Redis)
│   ├── images.ts               # Listagem de imagens Cloudinary
│   ├── projects.ts             # Projetos públicos (Redis)
│   └── admin/
│       ├── login.ts            # Autenticação HMAC-SHA256
│       ├── content.ts          # CRUD conteúdo (autenticado)
│       ├── projects.ts         # CRUD projetos (autenticado)
│       └── upload.ts           # Upload de imagens para Cloudinary
├── public/                     # Assets estáticos (favicon, imagens)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/             # Seções da página pública
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── MethodSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── TestimonialsSection.tsx  # Depoimentos com cards (máx 3 em destaque)
│   │   ├── ContactSection.tsx       # Formulário com Turnstile anti-spam
│   │   ├── CtaSection.tsx
│   │   ├── Footer.tsx
│   │   ├── CookieBanner.tsx         # Consentimento LGPD
│   │   └── PrivacyModal.tsx         # Política de privacidade
│   ├── context/
│   │   └── SiteContentContext.tsx   # Contexto global (Redis + defaults com deep merge)
│   ├── data/
│   │   └── defaultContent.ts        # Valores padrão de todo o conteúdo do site
│   ├── pages/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx       # Painel com abas: Portfólio e Conteúdo
│   │   └── AdminContent.tsx         # CMS com 12 seções editáveis
│   ├── types/
│   │   └── content.ts               # Interfaces TypeScript do modelo de conteúdo
│   └── utils/
│       ├── analytics.ts             # GA4 + Vercel Analytics (eventos de lead)
│       └── scroll.ts                # Scroll suave entre seções
├── server.ts                        # Servidor Express para desenvolvimento local
└── index.html                       # SEO, OG tags, GA4 Consent Mode v2, Clarity, LinkedIn
```

---

## Rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

---

## Variáveis de ambiente

Crie um `.env.local` com:

```env
# Google Analytics 4
VITE_GA_ID=G-XXXXXXXXXX

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxx
TURNSTILE_SECRET_KEY=0x4AAAAAAAxxxxxxxxxxx

# Upstash Redis
KV_REST_API_URL=https://your-url.upstash.io
KV_REST_API_TOKEN=your-token

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
VITE_CLOUDINARY_FOLDER=portfolio/ivan

# Resend (e-mail)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Admin
ADMIN_PASSWORD=sua-senha-segura
```

> No Vercel, adicione as mesmas variáveis em **Settings → Environment Variables**.

---

## Painel Admin

Acesse `/admin` com a senha definida em `ADMIN_PASSWORD`.

**Aba Portfólio**
- CRUD de projetos com upload de múltiplas fotos
- Moldura por foto: `phone` / `desktop` / `none`

**Aba Conteúdo** — CMS com 12 seções editáveis:

| Seção | O que é editável |
|---|---|
| Hero | Label, título, subtítulo, texto acionável, CTA, foto |
| O Consultor | Bio, cards de stats, foto |
| Formações | Jornada acadêmica, especializações, certificações (4–10) |
| O Contexto | Texto e lista de dores |
| Portfólio | Label, título e resumo da seção |
| Serviços | 8 slots com toggle (exige exatamente 3 ou 6 habilitados) |
| O Método | Texto + até 4 passos |
| FAQ | Perguntas com toggle "featured" (máx. 4 em destaque) |
| Depoimentos | Cards com nome, cargo, empresa, texto e foto; toggle "featured" (máx. 3) |
| Diagnóstico | Texto, passos, e-mail de destino, CTA |
| Próximo Nível | Texto de fundo, título, destaque, CTAs |
| Rodapé | Nome, tagline, e-mail, telefone, WhatsApp, LinkedIn, localização |

---

## Analytics & Monitoramento

### Eventos rastreados (GA4 + Vercel Analytics)

| Evento | Gatilho |
|---|---|
| `lead_form_submit` + `generate_lead` | Formulário de diagnóstico enviado |
| `cta_click` | Botão "Agendar Conversa" (Hero e CTA) |
| `whatsapp_click` | Links WhatsApp (Hero, CTA, Footer) |
| `project_view` | Clique em "ver projeto" no portfólio |

### Ferramentas integradas

| Ferramenta | Função | Plano |
|---|---|---|
| Google Analytics 4 | Métricas + conversões | Gratuito |
| Vercel Analytics | Performance + Web Vitals | Gratuito |
| Microsoft Clarity | Heatmaps + gravação de sessões | Gratuito |
| LinkedIn Insight Tag | Audiência B2B + remarketing | Gratuito |
| Sentry | Monitoramento de erros em produção | Gratuito |

O GA4 usa **Consent Mode v2** — analytics bloqueado até o usuário aceitar os cookies via banner LGPD.

---

## SEO

- `public/sitemap.xml` — 5 URLs (homepage + seções âncora)
- `public/robots.txt` — indexação permitida + ponteiro pro sitemap
- Schema.org JSON-LD (`@graph`) com `Person` + `ProfessionalService`
- Open Graph + Twitter Card em `index.html`
- Canonical URL configurada

---

## Anti-spam

Formulário de contato protegido por **Cloudflare Turnstile** (challenge invisível):
- Widget renderizado client-side via `useEffect`
- Token validado server-side em `api/contact.ts` antes de enviar o e-mail
- Fallback: sem chave configurada, validação é ignorada (dev local)

---

## Deploy

O deploy é automático via Vercel a cada `git push` na branch `main`.

```bash
git add -A
git commit -m "feat: descrição da mudança"
git push
```
