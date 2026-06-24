import { useState, useEffect, useRef, type ChangeEvent, type ReactNode } from "react";
import { Plus, Pencil, Trash2, X, Save, LogOut, ExternalLink, Tag, ImageIcon, Smartphone, Monitor, Square } from "lucide-react";
import AdminContent from "./AdminContent";

type FrameType = "none" | "phone" | "desktop";

interface ProjectImage { url: string; frame: FrameType; }

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: (string | ProjectImage)[];
  image?: string;
}

type FormImage = ProjectImage;

interface FormState {
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: FormImage[];
}

const EMPTY: FormState = { title: "", desc: "", link: "", tags: [], images: [] };

const FRAME_ICONS: Record<FrameType, ReactNode> = {
  none:    <Square size={10} />,
  phone:   <Smartphone size={10} />,
  desktop: <Monitor size={10} />,
};

function normalizeImages(raw: (string | ProjectImage)[]): FormImage[] {
  return raw.map((img) =>
    typeof img === "string" ? { url: img, frame: "none" as FrameType } : img
  );
}

function getImages(p: Project): FormImage[] {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  return normalizeImages(imgs);
}

interface Props { onLogout: () => void; }

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<"projetos" | "conteudo">("projetos");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("admin_token") || "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { headers });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch { setError("Erro ao carregar projetos."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setForm(EMPTY); setTagsInput(""); setEditing(null); setIsNew(true); setError(""); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, desc: p.desc, link: p.link, tags: p.tags, images: getImages(p) });
    setTagsInput(p.tags.join(", "));
    setEditing(p); setIsNew(false); setError("");
  };
  const closePanel = () => { setEditing(null); setIsNew(false); setError(""); };

  const compressImage = (file: File): Promise<string> =>
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

  const uploadFile = async (file: File): Promise<string> => {
    const base64 = await compressImage(file);
    const res = await fetch("/api/admin/upload", {
      method: "POST", headers,
      body: JSON.stringify({ image: base64, filename: file.name }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Falha"); }
    const { url } = await res.json();
    return url;
  };

  const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setForm((f) => ({ ...f, images: [...f.images, ...urls.map((url) => ({ url, frame: "none" as FrameType }))] }));
    } catch (err: any) { setError("Erro no upload: " + err.message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const setImageFrame = (idx: number, frame: FrameType) =>
    setForm((f) => ({ ...f, images: f.images.map((img, i) => i === idx ? { ...img, frame } : img) }));

  const handleSave = async () => {
    setSaving(true); setError("");
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      const res = isNew
        ? await fetch("/api/admin/projects", { method: "POST", headers, body: JSON.stringify(payload) })
        : await fetch(`/api/admin/projects?id=${editing!.id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      await fetchProjects();
      closePanel();
    } catch { setError("Erro ao salvar."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Remover "${title}"?`)) return;
    try {
      await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE", headers });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch { setError("Erro ao remover."); }
  };

  const panelOpen = isNew || editing !== null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-4">
          <a href="/" className="font-extrabold text-xl tracking-tighter text-accent">IS.</a>
          <span className="text-[10px] text-muted uppercase tracking-[4px] hidden sm:block">Admin Panel</span>
          <div className="flex gap-1 ml-4">
            {(["projetos", "conteudo"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border
                  ${tab === t ? "bg-accent text-white border-accent" : "border-border text-muted hover:text-foreground"}`}>
                {t === "projetos" ? "Portfólio" : "Conteúdo"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
          <LogOut size={14} /> Sair
        </button>
      </header>

      {tab === "conteudo" && <AdminContent token={token} />}

      {tab === "projetos" && <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] block mb-2">Portfólio</span>
            <h1 className="text-3xl font-extrabold tracking-tighter">Aplicações em Produção</h1>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-accent text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
            <Plus size={14} /> Novo Projeto
          </button>
        </div>

        {error && !panelOpen && <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-6">{error}</p>}

        {loading ? (
          <div className="text-xs text-muted uppercase tracking-widest animate-pulse">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const imgs = getImages(project);
              return (
                <div key={project.id} className="flex items-center gap-4 p-5 border border-border hover:border-accent/40 transition-all group">
                  <div className="flex gap-1 shrink-0">
                    {imgs.slice(0, 3).map((img, i) => (
                      <div key={i} className="w-16 h-12 border border-border/50 overflow-hidden bg-surface relative">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 text-[8px]">
                          {img.frame === "phone" ? "📱" : img.frame === "desktop" ? "🖥️" : ""}
                        </span>
                      </div>
                    ))}
                    {imgs.length === 0 && (
                      <div className="w-16 h-12 border border-border/50 flex items-center justify-center">
                        <ImageIcon size={14} className="text-muted/30" />
                      </div>
                    )}
                    {imgs.length > 3 && (
                      <div className="w-16 h-12 border border-border/50 flex items-center justify-center bg-surface">
                        <span className="text-[10px] text-muted font-bold">+{imgs.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm uppercase tracking-tight truncate">{project.title}</span>
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-muted hover:text-accent shrink-0"><ExternalLink size={12} /></a>
                    </div>
                    <p className="text-xs text-muted truncate mb-2">{project.desc}</p>
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] border border-border px-2 py-0.5 uppercase tracking-tight text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(project)} className="p-2 border border-border hover:border-accent hover:text-accent transition-all"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(project.id, project.title)} className="p-2 border border-border hover:border-red-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border">
                <p className="text-xs text-muted uppercase tracking-widest">Nenhum projeto cadastrado</p>
              </div>
            )}
          </div>
        )}
      </div>}

      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={closePanel} />
          <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <h2 className="text-sm font-extrabold uppercase tracking-widest">{isNew ? "Novo Projeto" : "Editar Projeto"}</h2>
              <button onClick={closePanel} className="text-muted hover:text-accent"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

              {/* Grid de imagens com seletor de frame por foto */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">
                  Fotos <span className="opacity-50 normal-case font-normal">({form.images.length})</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="relative aspect-video border border-border overflow-hidden group/img bg-surface">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[8px] bg-accent text-white px-1.5 py-0.5 uppercase tracking-widest font-bold">Capa</span>
                        )}
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-background/80 p-1 opacity-0 group-hover/img:opacity-100 transition-opacity hover:text-red-500"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      {/* Frame selector por foto */}
                      <div className="flex gap-0.5">
                        {(["none", "phone", "desktop"] as FrameType[]).map((f) => (
                          <button
                            key={f}
                            onClick={() => setImageFrame(idx, f)}
                            title={f === "none" ? "Sem moldura" : f === "phone" ? "Celular" : "Desktop"}
                            className={`flex-1 flex items-center justify-center py-1 border text-[9px] transition-all
                              ${img.frame === f ? "border-accent text-accent bg-accent/5" : "border-border text-muted hover:border-muted"}`}
                          >
                            {FRAME_ICONS[f]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Botão adicionar */}
                  <div className="space-y-1">
                    <button
                      onClick={() => !uploading && fileRef.current?.click()}
                      disabled={uploading}
                      className={`w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all
                        ${uploading ? "border-accent/30 cursor-wait" : "border-border hover:border-accent cursor-pointer"}`}
                    >
                      {uploading
                        ? <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        : <><Plus size={14} className="text-muted" /><span className="text-[9px] text-muted uppercase">Adicionar</span></>
                      }
                    </button>
                    <div className="h-[26px]" /> {/* espaço para alinhar com seletores */}
                  </div>
                </div>

                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
              </div>
              {/* Titulo */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Titulo *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome do projeto" required className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm font-light transition-colors" />
              </div>

              {/* Descricao */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Descricao *</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="Descricao breve do projeto" required className="w-full bg-transparent border border-border p-3 focus:border-accent focus:outline-none text-sm font-light transition-colors resize-none" />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Link *</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." required className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm font-light transition-colors" />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Tags</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="React, Node.js, PostgreSQL" className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none text-sm font-light transition-colors" />
                <p className="text-[10px] text-muted">Separe por virgula</p>
                {tagsInput && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] border border-border px-2 py-0.5 uppercase">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{error}</p>}
            </div>

            <div className="px-8 py-6 border-t border-border flex gap-3">
              <button onClick={handleSave} disabled={saving || uploading} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all">
                {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={closePanel} className="px-6 py-3 border border-border text-xs font-bold uppercase tracking-widest text-muted hover:text-foreground hover:border-muted transition-all">
                Cancelar
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
