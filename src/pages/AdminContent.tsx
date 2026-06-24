import { useState, useEffect, useRef, type ReactNode } from "react";
import { Save, Plus, Trash2, Upload, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from "lucide-react";
import { SiteContent, ServiceCard, MethodStep, FaqItem, ContactStep, AcademicEntry, Certification, Testimonial } from "../types/content";
import { defaultContent } from "../data/defaultContent";

const SECTIONS = [
  { key: "hero",       label: "Hero" },
  { key: "about",      label: "O Consultor" },
  { key: "formacao",   label: "Formações" },
  { key: "experience", label: "O Contexto" },
  { key: "portfolio",  label: "Portfólio" },
  { key: "services",   label: "Serviços" },
  { key: "method",     label: "O Método" },
  { key: "faq",        label: "FAQ" },
  { key: "testimonials", label: "Depoimentos" },
  { key: "contact",    label: "Diagnóstico" },
  { key: "cta",        label: "Próximo Nível" },
  { key: "footer",     label: "Rodapé" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

const ICON_OPTIONS = [
  "workflow","database","cpu","settings","shield-check","trending-up",
  "code","globe","zap","users","lock","bar-chart","bot","layers",
];

interface Props { token: string; }

// ─── Shared field components ──────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-muted block">{label}</label>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm"
    />
  );
}
function Textarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value} rows={rows} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-border p-4 focus:border-accent focus:outline-none transition-colors text-sm resize-none"
    />
  );
}

// ─── Upload helper ─────────────────────────────────────────────────────────────
function useUpload(token: string) {
  const [uploading, setUploading] = useState(false);

  const compress = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        const isPng = file.type === "image/png";
        if (!isPng) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(isPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = url;
    });

  const upload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const base64 = await compress(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, filename: file.name }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { url } = await res.json();
      return url;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}

// ─── Photo picker ─────────────────────────────────────────────────────────────
function PhotoPicker({ label, value, onChange, token }: { label: string; value: string; onChange: (url: string) => void; token: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload(token);

  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="" className="w-20 h-16 object-cover border border-border" />
        )}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all disabled:opacity-50"
        >
          <Upload size={12} /> {uploading ? "Enviando..." : "Trocar foto"}
        </button>
        <input
          ref={ref} type="file" accept="image/*" className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try { const url = await upload(file); onChange(url); }
            catch (err: any) { alert("Erro: " + err.message); }
            finally { e.target.value = ""; }
          }}
        />
      </div>
    </Field>
  );
}

// ─── Section header fields (comum a todas as seções) ─────────────────────────
function SectionHeader({ label, title, summary, onChange }: { label: string; title: string; summary?: string; onChange: (f: string, v: string) => void }) {
  return (
    <>
      <Field label="Label da seção (ex: 01 — O Contexto)">
        <Input value={label} onChange={(v) => onChange("label", v)} placeholder="00 — Seção" />
      </Field>
      <Field label="Título">
        <Input value={title} onChange={(v) => onChange("title", v)} />
      </Field>
      {summary !== undefined && (
        <Field label="Resumo">
          <Textarea value={summary} onChange={(v) => onChange("summary", v)} />
        </Field>
      )}
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AdminContent({ token }: Props) {
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch("/api/admin/content", { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.content) setContent((prev) => ({ ...prev, ...d.content })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT", headers,
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { setError("Erro ao salvar."); }
    finally { setSaving(false); }
  };

  const set = <K extends keyof SiteContent>(section: K, patch: Partial<SiteContent[K]>) => {
    setContent((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  if (loading) return <div className="text-xs text-muted uppercase tracking-widest animate-pulse p-8">Carregando conteúdo...</div>;

  return (
    <div className="flex gap-0 min-h-[calc(100vh-64px)]">
      {/* Sidebar de seções */}
      <nav className="w-44 shrink-0 border-r border-border py-4">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`w-full text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all
              ${activeSection === s.key ? "text-accent bg-accent/5 border-r-2 border-accent" : "text-muted hover:text-foreground"}`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 max-w-2xl">

          {/* ── Hero ── */}
          {activeSection === "hero" && (() => {
            const h = content.hero;
            const upd = (f: string, v: string) => set("hero", { [f]: v } as any);
            return (
              <>
                <Field label="Label da seção">
                  <Input value={h.label} onChange={(v) => upd("label", v)} placeholder="Consultoria Estratégica Premium" />
                </Field>
                <Field label="Headline (use \n para quebra de linha)">
                  <Textarea value={h.headline} onChange={(v) => upd("headline", v)} rows={2} />
                </Field>
                <Field label="Subtítulo">
                  <Textarea value={h.subtitle} onChange={(v) => upd("subtitle", v)} />
                </Field>
                <Field label="Texto acionável">
                  <Textarea value={h.actionableText} onChange={(v) => upd("actionableText", v)} />
                </Field>
                <Field label="Texto do CTA principal">
                  <Input value={h.ctaPrimary} onChange={(v) => upd("ctaPrimary", v)} />
                </Field>
                <PhotoPicker label="Foto (hero)" value={h.photoUrl} onChange={(url) => upd("photoUrl", url)} token={token} />
              </>
            );
          })()}

          {/* ── O Consultor ── */}
          {activeSection === "about" && (() => {
            const ab = content.about;
            const upd = (f: string, v: any) => set("about", { [f]: v } as any);
            return (
              <>
                <SectionHeader label={ab.label} title={`${ab.title} ${ab.titleAccent}`} summary={ab.summary} onChange={(f, v) => {
                  if (f === "title") {
                    // Split em título + acento (última palavra = acento)
                    const parts = v.trim().split(" ");
                    upd("titleAccent", parts.pop() || "");
                    upd("title", parts.join(" "));
                  } else { upd(f, v); }
                }} />
                <Field label="Parágrafo 1">
                  <Textarea value={ab.paragraph1} onChange={(v) => upd("paragraph1", v)} rows={4} />
                </Field>
                <Field label="Parágrafo 2">
                  <Textarea value={ab.paragraph2} onChange={(v) => upd("paragraph2", v)} rows={4} />
                </Field>
                <PhotoPicker label="Foto principal" value={ab.photoUrl} onChange={(url) => upd("photoUrl", url)} token={token} />
                <div className="border-t border-border pt-6 space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Cards laterais</p>
                  <Field label="Card destaque — valor">
                    <Input value={ab.statCard.value} onChange={(v) => upd("statCard", { ...ab.statCard, value: v })} placeholder="29" />
                  </Field>
                  <Field label="Card destaque — label">
                    <Input value={ab.statCard.label} onChange={(v) => upd("statCard", { ...ab.statCard, label: v })} />
                  </Field>
                  <Field label="Card função — título">
                    <Input value={ab.roleCard.title} onChange={(v) => upd("roleCard", { ...ab.roleCard, title: v })} />
                  </Field>
                  <Field label="Card função — subtítulo">
                    <Input value={ab.roleCard.subtitle} onChange={(v) => upd("roleCard", { ...ab.roleCard, subtitle: v })} />
                  </Field>
                  <Field label="Card pessoal — título">
                    <Input value={ab.personalCard.title} onChange={(v) => upd("personalCard", { ...ab.personalCard, title: v })} />
                  </Field>
                  <Field label="Card pessoal — data de nascimento (calcula idade automaticamente)">
                    <input
                      type="date" value={ab.personalCard.birthDate}
                      onChange={(e) => upd("personalCard", { ...ab.personalCard, birthDate: e.target.value })}
                      className="bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm"
                    />
                  </Field>
                </div>
              </>
            );
          })()}

          {/* ── Formações ── */}
          {activeSection === "formacao" && (() => {
            const fm = content.formacao;
            const upd = (f: string, v: any) => set("formacao", { [f]: v } as any);
            return (
              <>
                <SectionHeader label={fm.label} title={fm.title} summary={fm.summary} onChange={(f, v) => upd(f, v)} />

                {/* Jornada Acadêmica */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Jornada Acadêmica</p>
                    <button onClick={() => upd("academicJourney", [...fm.academicJourney, { id: Date.now().toString(), institution: "", course: "", period: "" }])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {fm.academicJourney.map((entry: AcademicEntry, i: number) => (
                    <div key={entry.id} className="border border-border p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-muted">Entrada {i + 1}</span>
                        <button onClick={() => upd("academicJourney", fm.academicJourney.filter((_: any, j: number) => j !== i))}
                          className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                      </div>
                      <Input value={entry.institution} onChange={(v) => upd("academicJourney", fm.academicJourney.map((e: AcademicEntry, j: number) => j === i ? { ...e, institution: v } : e))} placeholder="Instituição" />
                      <Input value={entry.course} onChange={(v) => upd("academicJourney", fm.academicJourney.map((e: AcademicEntry, j: number) => j === i ? { ...e, course: v } : e))} placeholder="Curso" />
                      <Input value={entry.period} onChange={(v) => upd("academicJourney", fm.academicJourney.map((e: AcademicEntry, j: number) => j === i ? { ...e, period: v } : e))} placeholder="2017 — 2019" />
                    </div>
                  ))}
                </div>

                {/* Especializações */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Especializações</p>
                    <button onClick={() => upd("specializations", [...fm.specializations, ""])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {fm.specializations.map((s: string, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input value={s} onChange={(v) => upd("specializations", fm.specializations.map((x: string, j: number) => j === i ? v : x))} placeholder="Ex: UX/UI Design — PUC" />
                      <button onClick={() => upd("specializations", fm.specializations.filter((_: any, j: number) => j !== i))}
                        className="text-red-500 shrink-0"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>

                {/* Certificações */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                      Certificações ({fm.certifications.length}/10)
                    </p>
                    {fm.certifications.length < 10 && (
                      <button onClick={() => upd("certifications", [...fm.certifications, { id: Date.now().toString(), name: "", issuer: "", imageUrl: "" }])}
                        className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                        <Plus size={10} /> Adicionar
                      </button>
                    )}
                  </div>
                  {fm.certifications.map((cert: Certification, i: number) => (
                    <div key={cert.id} className="border border-border p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-muted">Certificação {i + 1}</span>
                        {fm.certifications.length > 4 && (
                          <button onClick={() => upd("certifications", fm.certifications.filter((_: any, j: number) => j !== i))}
                            className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                        )}
                      </div>
                      <Input value={cert.name} onChange={(v) => upd("certifications", fm.certifications.map((c: Certification, j: number) => j === i ? { ...c, name: v } : c))} placeholder="Nome da certificação" />
                      <Input value={cert.issuer} onChange={(v) => upd("certifications", fm.certifications.map((c: Certification, j: number) => j === i ? { ...c, issuer: v } : c))} placeholder="Emissor" />
                      <PhotoPicker label="Badge" value={cert.imageUrl} onChange={(url) => upd("certifications", fm.certifications.map((c: Certification, j: number) => j === i ? { ...c, imageUrl: url } : c))} token={token} />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── O Contexto ── */}
          {activeSection === "experience" && (() => {
            const ex = content.experience;
            const upd = (f: string, v: any) => set("experience", { [f]: v } as any);
            return (
              <>
                <SectionHeader label={ex.label} title={ex.title} summary={ex.summary} onChange={(f, v) => upd(f, v)} />
                <Field label="Parágrafo explicativo">
                  <Textarea value={ex.paragraph} onChange={(v) => upd("paragraph", v)} rows={4} />
                </Field>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Pontos de dor</p>
                    <button onClick={() => upd("painPoints", [...ex.painPoints, ""])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {ex.painPoints.map((pt: string, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input value={pt} onChange={(v) => upd("painPoints", ex.painPoints.map((x: string, j: number) => j === i ? v : x))} placeholder="Ex: Gargalos constantes..." />
                      <button onClick={() => upd("painPoints", ex.painPoints.filter((_: any, j: number) => j !== i))}
                        className="text-red-500 shrink-0"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── Portfólio ── */}
          {activeSection === "portfolio" && (() => {
            const pf = content.portfolio;
            const upd = (f: string, v: string) => set("portfolio", { [f]: v } as any);
            return (
              <SectionHeader label={pf.label} title={pf.title} summary={pf.summary} onChange={(f, v) => upd(f, v)} />
            );
          })()}

          {/* ── Serviços ── */}
          {activeSection === "services" && (() => {
            const sv = content.services;
            const upd = (f: string, v: any) => set("services", { [f]: v } as any);
            const active = sv.cards.filter((c) => c.enabled && c.title).length;
            const validCount = active === 3 || active === 6;

            return (
              <>
                <SectionHeader label={sv.label} title={sv.title} summary={sv.summary} onChange={(f, v) => upd(f, v)} />
                <div className={`text-[10px] font-bold uppercase tracking-widest p-3 border ${validCount ? "border-green-500/30 text-green-500" : "border-yellow-500/30 text-yellow-500"}`}>
                  {active} cards habilitados — {validCount ? "✓ válido" : "⚠ habilite exatamente 3 ou 6"}
                </div>
                <div className="border-t border-border pt-6 space-y-4">
                  {sv.cards.map((card: ServiceCard, i: number) => {
                    const onChange = (updated: ServiceCard) => upd("cards", sv.cards.map((c: ServiceCard, j: number) => j === i ? updated : c));
                    // @ts-ignore React 19 key prop type quirk
                    return <CardEditor key={card.id} card={card} index={i} onChange={onChange} />;
                  })}
                </div>
              </>
            );
          })()}

          {/* ── O Método ── */}
          {activeSection === "method" && (() => {
            const mt = content.method;
            const upd = (f: string, v: any) => set("method", { [f]: v } as any);
            return (
              <>
                <SectionHeader label={mt.label} title={mt.title} summary={mt.summary} onChange={(f, v) => upd(f, v)} />
                <Field label="Texto do CTA">
                  <Input value={mt.ctaText} onChange={(v) => upd("ctaText", v)} />
                </Field>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Steps ({mt.steps.length}/4)</p>
                    {mt.steps.length < 4 && (
                      <button onClick={() => upd("steps", [...mt.steps, { id: Date.now().toString(), step: `0${mt.steps.length + 1}`, title: "", desc: "" }])}
                        className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                        <Plus size={10} /> Adicionar
                      </button>
                    )}
                  </div>
                  {mt.steps.map((step: MethodStep, i: number) => (
                    <div key={step.id} className="border border-border p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-accent font-mono">{step.step}</span>
                        {mt.steps.length > 1 && (
                          <button onClick={() => upd("steps", mt.steps.filter((_: any, j: number) => j !== i))}
                            className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                        )}
                      </div>
                      <Input value={step.step} onChange={(v) => upd("steps", mt.steps.map((s: MethodStep, j: number) => j === i ? { ...s, step: v } : s))} placeholder="01" />
                      <Input value={step.title} onChange={(v) => upd("steps", mt.steps.map((s: MethodStep, j: number) => j === i ? { ...s, title: v } : s))} placeholder="Título do step" />
                      <Textarea value={step.desc} onChange={(v) => upd("steps", mt.steps.map((s: MethodStep, j: number) => j === i ? { ...s, desc: v } : s))} rows={2} placeholder="Descrição..." />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── FAQ ── */}
          {activeSection === "faq" && (() => {
            const fq = content.faq;
            const upd = (f: string, v: any) => set("faq", { [f]: v } as any);
            const featuredCount = fq.questions.filter((q: FaqItem) => q.featured).length;
            return (
              <>
                <SectionHeader label={fq.label} title={fq.title} summary={fq.summary} onChange={(f, v) => upd(f, v)} />
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {featuredCount} em destaque (máx 4) — {fq.questions.length} total
                </p>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Perguntas</p>
                    <button onClick={() => upd("questions", [...fq.questions, { id: Date.now().toString(), question: "", answer: "", featured: featuredCount < 4 }])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {fq.questions.map((item: FaqItem, i: number) => (
                    <div key={item.id} className={`border p-4 space-y-3 ${item.featured ? "border-accent/40" : "border-border"}`}>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            const newFeatured = !item.featured;
                            if (newFeatured && featuredCount >= 4) { alert("Máximo 4 em destaque."); return; }
                            upd("questions", fq.questions.map((q: FaqItem, j: number) => j === i ? { ...q, featured: newFeatured } : q));
                          }}
                          className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${item.featured ? "text-accent" : "text-muted"}`}
                        >
                          {item.featured ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {item.featured ? "Destaque" : "Secundária"}
                        </button>
                        <button onClick={() => upd("questions", fq.questions.filter((_: any, j: number) => j !== i))}
                          className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                      </div>
                      <Input value={item.question} onChange={(v) => upd("questions", fq.questions.map((q: FaqItem, j: number) => j === i ? { ...q, question: v } : q))} placeholder="Pergunta..." />
                      <Textarea value={item.answer} onChange={(v) => upd("questions", fq.questions.map((q: FaqItem, j: number) => j === i ? { ...q, answer: v } : q))} rows={3} placeholder="Resposta..." />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}


          {/* ── Depoimentos ── */}
          {activeSection === "testimonials" && (() => {
            const tm = content.testimonials;
            const upd = (f: string, v: any) => set("testimonials", { [f]: v } as any);
            const featuredCount = tm.items.filter((t: Testimonial) => t.featured).length;
            return (
              <>
                <SectionHeader label={tm.label} title={tm.title} summary={tm.summary} onChange={(f, v) => upd(f, v)} />
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {featuredCount} em destaque (máx 3) — {tm.items.length} total
                </p>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Depoimentos</p>
                    <button onClick={() => upd("items", [...tm.items, {
                      id: Date.now().toString(),
                      name: "", role: "", company: "", text: "", photoUrl: "", featured: featuredCount < 3
                    }])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {tm.items.map((item: Testimonial, i: number) => (
                    <div key={item.id} className={`border p-4 space-y-3 ${item.featured ? "border-accent/40" : "border-border"}`}>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            const newFeatured = !item.featured;
                            if (newFeatured && featuredCount >= 3) { alert("Máximo 3 em destaque."); return; }
                            upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, featured: newFeatured } : t));
                          }}
                          className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${item.featured ? "text-accent" : "text-muted"}`}
                        >
                          {item.featured ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {item.featured ? "Destaque" : "Oculto"}
                        </button>
                        <button onClick={() => upd("items", tm.items.filter((_: any, j: number) => j !== i))}
                          className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Nome">
                          <Input value={item.name} onChange={(v) => upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, name: v } : t))} placeholder="Carlos Silva" />
                        </Field>
                        <Field label="Cargo">
                          <Input value={item.role} onChange={(v) => upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, role: v } : t))} placeholder="CTO" />
                        </Field>
                      </div>
                      <Field label="Empresa">
                        <Input value={item.company} onChange={(v) => upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, company: v } : t))} placeholder="Empresa X" />
                      </Field>
                      <Field label="Depoimento">
                        <Textarea value={item.text} onChange={(v) => upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, text: v } : t))} rows={3} placeholder="O que disse sobre o Ivan..." />
                      </Field>
                      <PhotoPicker
                        label="Foto (avatar)"
                        value={item.photoUrl}
                        onChange={(url) => upd("items", tm.items.map((t: Testimonial, j: number) => j === i ? { ...t, photoUrl: url } : t))}
                        token={token}
                      />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── Diagnóstico ── */}
          {activeSection === "contact" && (() => {
            const ct = content.contact;
            const upd = (f: string, v: any) => set("contact", { [f]: v } as any);
            return (
              <>
                <SectionHeader label={ct.label} title={ct.title} summary={ct.summary} onChange={(f, v) => upd(f, v)} />
                <Field label="Palavra em destaque (cor accent)">
                  <Input value={ct.accentWord} onChange={(v) => upd("accentWord", v)} placeholder="sua entrega?" />
                </Field>
                <Field label="Texto do botão">
                  <Input value={ct.ctaText} onChange={(v) => upd("ctaText", v)} />
                </Field>
                <Field label="E-mail que recebe as mensagens">
                  <input
                    type="email" value={ct.contactEmail}
                    onChange={(e) => upd("contactEmail", e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm"
                    placeholder="seu@email.com"
                  />
                </Field>
                <Field label="Nota do formulário">
                  <Input value={ct.formNote} onChange={(v) => upd("formNote", v)} />
                </Field>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Steps do processo</p>
                    <button onClick={() => upd("steps", [...ct.steps, { id: Date.now().toString(), num: `0${ct.steps.length + 1}`, title: "", sub: "" }])}
                      className="text-[10px] font-bold text-accent flex items-center gap-1 hover:opacity-70">
                      <Plus size={10} /> Adicionar
                    </button>
                  </div>
                  {ct.steps.map((step: ContactStep, i: number) => (
                    <div key={step.id} className="border border-border p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-muted">{step.num}</span>
                        {ct.steps.length > 1 && (
                          <button onClick={() => upd("steps", ct.steps.filter((_: any, j: number) => j !== i))}
                            className="text-red-500 hover:opacity-70"><Trash2 size={12} /></button>
                        )}
                      </div>
                      <Input value={step.num} onChange={(v) => upd("steps", ct.steps.map((s: ContactStep, j: number) => j === i ? { ...s, num: v } : s))} placeholder="01" />
                      <Input value={step.title} onChange={(v) => upd("steps", ct.steps.map((s: ContactStep, j: number) => j === i ? { ...s, title: v } : s))} placeholder="Título" />
                      <Input value={step.sub} onChange={(v) => upd("steps", ct.steps.map((s: ContactStep, j: number) => j === i ? { ...s, sub: v } : s))} placeholder="Subtítulo" />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── CTA / Próximo Nível ── */}
          {activeSection === "cta" && (() => {
            const cta = content.cta;
            const upd = (f: string, v: string) => set("cta", { [f]: v } as any);
            return (
              <>
                <Field label="Texto de fundo (grande, decorativo)">
                  <Textarea value={cta.backgroundText} onChange={(v) => upd("backgroundText", v)} rows={2} />
                </Field>
                <Field label="Título principal">
                  <Input value={cta.title} onChange={(v) => upd("title", v)} />
                </Field>
                <Field label="Parte em destaque (accent)">
                  <Input value={cta.accentPart} onChange={(v) => upd("accentPart", v)} />
                </Field>
                <Field label="Texto botão primário">
                  <Input value={cta.ctaPrimary} onChange={(v) => upd("ctaPrimary", v)} />
                </Field>
                <Field label="Texto botão WhatsApp">
                  <Input value={cta.ctaWhatsApp} onChange={(v) => upd("ctaWhatsApp", v)} />
                </Field>
              </>
            );
          })()}

          {/* ── Rodapé ── */}
          {activeSection === "footer" && (() => {
            const ft = content.footer;
            const upd = (f: string, v: string) => set("footer", { [f]: v } as any);
            return (
              <>
                <Field label="Nome"><Input value={ft.name} onChange={(v) => upd("name", v)} /></Field>
                <Field label="Tagline"><Textarea value={ft.tagline} onChange={(v) => upd("tagline", v)} rows={2} /></Field>
                <Field label="E-mail">
                  <input type="email" value={ft.email} onChange={(e) => upd("email", e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm" />
                </Field>
                <Field label="Telefone (exibição)"><Input value={ft.phone} onChange={(v) => upd("phone", v)} placeholder="+55 75 99872-3992" /></Field>
                <Field label="WhatsApp (número com DDD, sem +)"><Input value={ft.whatsappNumber} onChange={(v) => upd("whatsappNumber", v)} placeholder="5575998723992" /></Field>
                <Field label="URL LinkedIn"><Input value={ft.linkedinUrl} onChange={(v) => upd("linkedinUrl", v)} /></Field>
                <Field label="Localização"><Input value={ft.location} onChange={(v) => upd("location", v)} placeholder="Brasil — Global Delivery" /></Field>
                <Field label="Copyright"><Input value={ft.copyright} onChange={(v) => upd("copyright", v)} /></Field>
              </>
            );
          })()}

        </div>

        {/* Footer do editor */}
        <div className="sticky bottom-0 px-8 py-4 border-t border-border bg-background flex items-center gap-4">
          {error && <p className="text-xs text-red-500 font-bold uppercase">{error}</p>}
          {saved && <p className="text-xs text-green-500 font-bold uppercase tracking-widest">✓ Salvo</p>}
          <button
            onClick={saveSection}
            disabled={saving}
            className="ml-auto flex items-center gap-2 bg-accent text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Save size={13} /> {saving ? "Salvando..." : "Salvar seção"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card editor para Serviços ─────────────────────────────────────────────────
function CardEditor({ card, index, onChange }: { card: ServiceCard; index: number; onChange: (c: ServiceCard) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border ${card.enabled ? "border-accent/40" : "border-border"} overflow-hidden`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange({ ...card, enabled: !card.enabled })}
            className={card.enabled ? "text-accent" : "text-muted"}
          >
            {card.enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Card {index + 1}</span>
          {card.title && <span className="text-xs text-foreground">{card.title}</span>}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="text-muted hover:text-accent">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-muted font-bold">Ícone</label>
            <select
              value={card.icon}
              onChange={(e) => onChange({ ...card, icon: e.target.value })}
              className="w-full bg-surface border border-border px-3 py-2 text-xs"
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-muted font-bold">Título</label>
            <input value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })}
              className="w-full bg-transparent border-b border-border py-2 text-sm focus:border-accent focus:outline-none" placeholder="Ex: Delivery & Gestão" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-muted font-bold">Descrição</label>
            <textarea value={card.desc} onChange={(e) => onChange({ ...card, desc: e.target.value })} rows={3}
              className="w-full bg-transparent border border-border p-3 text-sm resize-none focus:border-accent focus:outline-none" placeholder="Descrição..." />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-muted font-bold">Tags (vírgula)</label>
            <input value={card.tags.join(", ")} onChange={(e) => onChange({ ...card, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              className="w-full bg-transparent border-b border-border py-2 text-sm focus:border-accent focus:outline-none" placeholder="Tag1, Tag2" />
          </div>
        </div>
      )}
    </div>
  );
}
