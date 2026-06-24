import { SiteContent } from "../types/content";

export const defaultContent: SiteContent = {
  hero: {
    label: "Consultoria Estratégica Premium",
    headline: "ENTREGANDO DE\nFORMA PREVISÍVEL.",
    subtitle:
      "10 anos transformando complexidade técnica em eficiência operacional para empresas que não aceitam gargalos na execução.",
    actionableText:
      "Ajudo empresas a tirar projetos de software do papel com previsibilidade de prazo e escopo — sem surpresas na entrega.",
    ctaPrimary: "Agendar Conversa de 20 min",
    photoUrl: "ivan-hero.jpg",
  },

  about: {
    label: "00 — O Consultor",
    title: "Prazer,",
    titleAccent: "Ivan.",
    summary: "Trabalho aproximando a tecnologia do negócio há 10 anos.",
    paragraph1:
      "Construí minha trajetória em consultorias de alta complexidade, operando em ecossistemas de Alta Disponibilidade. Meu histórico inclui a modernização de plataformas em grandes players do Setor Financeiro, Varejo e setor Farmacêutico.",
    paragraph2:
      "Após consolidar experiência em infraestruturas críticas do Mercado de Capitais, hoje foco meus esforços na Implementação Estratégica de IA. Em paralelo, alimento meu DNA empreendedor desenvolvendo soluções escaláveis e projetos de impacto social.",
    photoUrl: "sobre-tech.png",
    statCard: { value: "29", label: "Anos de Idade" },
    roleCard: { title: "Diretor Social & Atleta", subtitle: "Coyotes Basketball" },
    personalCard: { title: "Pai do Iuri", birthDate: "2025-04-17" },
  },

  formacao: {
    label: "Proof of Work",
    title: "Formação & Certificações",
    summary: "Comprometimento com a excelência técnica e metodologias ágeis de mercado.",
    academicJourney: [
      {
        id: "1",
        institution: "Mackenzie",
        course: "Análise e Desenv. de Sistemas",
        period: "2017 — 2019",
      },
    ],
    specializations: ["UX/UI Design — PUC", "Gestão de Projetos — USP"],
    certifications: [
      { id: "1", name: "PSM I", issuer: "Scrum.org", imageUrl: "badge-psm.png" },
      { id: "2", name: "PSPO I", issuer: "Scrum.org", imageUrl: "badge-pspo.png" },
      { id: "3", name: "OKR Foundation", issuer: "CertiProf", imageUrl: "badge-okr.png" },
      {
        id: "4",
        name: "Análise e Desenv. de Sistemas",
        issuer: "Mackenzie",
        imageUrl: "badge-mackenzie.png",
      },
    ],
  },

  experience: {
    label: "01 — O Contexto",
    title: "Sua operação tecnológica trava na hora de escalar?",
    summary:
      "A maioria das empresas enfrenta o mesmo gargalo: falta de previsibilidade, retrabalho constante e uma barreira invisível entre a visão de negócio e a execução técnica.",
    paragraph:
      "A maioria das empresas enfrenta o mesmo gargalo: falta de previsibilidade, retrabalho constante e uma barreira invisível entre a visão de negócio e a execução técnica.",
    painPoints: [
      "Gargalos constantes entre squads e áreas",
      "Arquiteturas frágeis que impedem a evolução",
      "Processos lentos e falta de visibilidade de dados",
      "Dificuldade em integrar IA de forma produtiva",
    ],
  },

  portfolio: {
    label: "02 — Portfólio",
    title: "Aplicações em produção.",
    summary: "Projetos reais que resolvem problemas reais. Da estratégia de entrega ao código final.",
  },

  services: {
    label: "02 — Serviços",
    title: "Expertise que gera valor.",
    summary: "Ofereço soluções sob medida, do desenho estratégico à implementação técnica.",
    cards: [
      {
        id: "1", enabled: true, icon: "workflow",
        title: "Delivery & Gestão",
        desc: "Consultoria em Kanban, Scrum e otimização de fluxo. Transformação de times lentos em máquinas de entrega previsíveis.",
        tags: ["Squads", "Métricas", "Governança"],
      },
      {
        id: "2", enabled: true, icon: "database",
        title: "Arquitetura & Backend",
        desc: "Desenvolvimento robusto com .NET, Java, Node e Python. Microserviços, DDD e foco total em performance e segurança.",
        tags: ["Cloud", "SQL/NoSQL", "DevOps"],
      },
      {
        id: "3", enabled: true, icon: "cpu",
        title: "Engenharia de IA",
        desc: "Uso estratégico de LLMs e automações (n8n, Make) para acelerar design de soluções e produtividade operacional.",
        tags: ["LLMs", "Automatização", "AI Core"],
      },
      {
        id: "4", enabled: true, icon: "settings",
        title: "Automação Industrial",
        desc: "Otimização de processos complexos através de software personalizado que reduz intervenção manual e erro humano.",
        tags: ["Workflow", "Integrações", "Efficiency"],
      },
      {
        id: "5", enabled: true, icon: "shield-check",
        title: "Segurança & Escala",
        desc: "Preparação de infraestruturas para picos de tráfego, garantindo disponibilidade e integridade dos dados sob pressão.",
        tags: ["Scaling", "Robustness", "SLA"],
      },
      {
        id: "6", enabled: true, icon: "trending-up",
        title: "Growth & CRO Tech",
        desc: "Implementação técnica de funis de venda e ferramentas de análise que permitem decisões baseadas em dados reais.",
        tags: ["Analytics", "Data-Driven", "Conversion"],
      },
      { id: "7", enabled: false, icon: "code", title: "", desc: "", tags: [] },
      { id: "8", enabled: false, icon: "globe", title: "", desc: "", tags: [] },
    ],
  },

  method: {
    label: "03 — O Método",
    title: "Como eu transformo sua operação.",
    summary:
      "Meu processo é pragmático e direto. Eu busco a clareza operacional primeiro, estabilizo a base tecnológica e então acelero através de automação e dados.",
    ctaText: "Iniciar Diagnóstico",
    steps: [
      { id: "1", step: "01", title: "Diagnóstico & Fluxo", desc: "Mapeamento de gargalos, análise de métricas (DORA Metrics) e identificação de silos operacionais." },
      { id: "2", step: "02", title: "Arquitetura & Base", desc: "Refatoração ou estruturação de backend robusto, garantindo que a tecnologia suporte o crescimento planejado." },
      { id: "3", step: "03", title: "Escala & Governança", desc: "Implementação de frameworks ágeis (Scrum/Kanban) e dashboards de gestão para visibilidade total." },
      { id: "4", step: "04", title: "Aceleração com IA", desc: "Integração de agentes autônomos e automações de processos para liberar o time para o que realmente importa." },
    ],
  },

  faq: {
    label: "04 — Dúvidas Frequentes",
    title: "Clarificando a parceria.",
    summary: "Respostas diretas e pragmáticas para os desafios que você enfrenta.",
    questions: [
      { id: "1", featured: true, question: "Você consegue entender meu contexto de negócio?", answer: "Absolutamente. Minha senioridade vem de ambientes de risco onde tecnologia é custo se não gerar ROI claro." },
      { id: "2", featured: true, question: "Você foca em gestão ou em código?", answer: "Sou um consultor híbrido. Desenho a estratégia de delivery e, se necessário, desço ao nível do backend para garantir a arquitetura." },
      { id: "3", featured: true, question: "Como a IA entra na sua consultoria?", answer: "Uso IA para acelerar a produtividade do seu time e criar automações de processos que hoje são manuais e lentos." },
      { id: "4", featured: true, question: "Vale a pena para empresas em estágio inicial?", answer: "Sim, especialmente se você quer evitar o 'débito técnico' e o 'caos operacional' que matam scale-ups cedo demais." },
    ],
  },

  contact: {
    label: "05 — Diagnóstico",
    title: "Vamos destravar",
    accentWord: "sua entrega?",
    summary:
      "Preencha as informações abaixo. Este diagnóstico é o primeiro passo para transformar caos em previsibilidade.",
    ctaText: "Agendar uma Conversa de 20 min",
    contactEmail: "ivanltds@gmail.com",
    formNote: "O envio agora é automático. Entrarei em contato em até 24h.",
    steps: [
      { id: "1", num: "01", title: "Análise de Cenário", sub: "Entendimento profundo da sua infra e processos." },
      { id: "2", num: "02", title: "Reunião Estratégica", sub: "Definição de objetivos e métricas de sucesso." },
      { id: "3", num: "03", title: "Plano de Execução", sub: "A proposta clara de como chegaremos lá." },
    ],
  },

  cta: {
    backgroundText: "RESULTS OVER\nTHEORY",
    title: "PRONTO PARA O",
    accentPart: "PRÓXIMO NÍVEL?",
    ctaPrimary: "Marcar Consultoria",
    ctaWhatsApp: "Iniciar WhatsApp",
  },

  footer: {
    name: "IVAN SOUZA",
    tagline: "Estrategista de Delivery & Engenharia de IA.\nAcelerando operações tecnológicas com rigor e visão de negócio.",
    email: "ivanltds@gmail.com",
    phone: "+55 75 99872-3992",
    whatsappNumber: "5575998723992",
    linkedinUrl: "https://www.linkedin.com/in/ivan-ltds/",
    location: "Brasil — Global Delivery",
    copyright: "© 2026 Ivan Souza.",
  },
};
