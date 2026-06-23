import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Save, LogOut, ExternalLink, Tag, Upload, ImageIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  image: string; // URL completa ou nome do arquivo
}

const EMPTY: Omit<Project, "id"> = { title: "", desc: "", link: "", tags: [], image: "" };

// Aceita URL completa ou nome de arquivo do Cloudinary
function getImageUrl(image: string): string {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const name = image.split(".")[0];
  return `https://res.cloudinary.com/dqt35bpzt/image/upload/f_auto,q_auto/portfolio/ivan/${name}`;
}

interface Props { onLogout: () => void; }

export default function AdminDashboard({ onLogout }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
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
    } catch {
      setError("Erro ao carregar projetos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => {
    setForm(EMPTY); setTagsInput(""); setPreviewUrl("");
    setEditing(null); setIsNew(true); setError("");
  };

  const openEdit = (p: Project) => {
    setForm({ title: p.title, desc: p.desc, link: p.link, tags: p.tags, image: p.image });
    setTagsInput(p.tags.join(", "));
    setPreviewUrl(getImageUrl(p.image));
    setEditing(p); setIsNew(false); setError("");
  };

  const closePanel = () => { setEditing(null); setIsNew(false); setError(""); setPreviewUrl(""); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local imediato enquanto faz upload
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({ image: base64, filename: file.name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha no upload");
      }

      const { url } = await res.json();
      // Salva a URL completa do Cloudinary — aparece na lista imediatamente
      setForm((f) => ({ ...f, image: url }));
      setPreviewUrl(url);
    } catch (err: any) {
      setError("Erro no upload: " + err.message);
      setPreviewUrl("");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      let res;
      if (isNew) {
        res = await fetch("/api/admin/projects", { method: "POST", headers, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/admin/projects/${editing!.id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
      }
      if (!res.ok) throw new Error();
      await fetchProjects();
      closePanel();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Remover "${title}"?`)) return;
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE", headers });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Erro ao remover.");
    }
  };

  const panelOpen = isNew || editing !== null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-4">
          <a href="/" className="font-extrabold text-xl tracking-tighter text-accent">IS.</a>
          <span className="text-[10px] text-muted uppercase tracking-[4px] hidden sm:block">Admin Panel</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
          <LogOut size={14} /> Sair
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] block mb-2">Portfólio</span>
            <h1 className="text-3xl font-extrabold tracking-tighter">Aplicações em Produção</h1>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-accent text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
            <Plus size={14} /> Novo Projeto
          </button>
        </div>

        {error && !panelOpen && (
          <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-6">{error}</p>
        )}

        {loading ? (
          <div className="text-xs text-muted uppercase tracking-widest animate-pulse">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const imgUrl = getImageUrl(project.image);
              return (
                <div key={project.id} className="flex items-center gap-4 p-5 border border-border bg-background hover:border-accent/40 transition-all group">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 shrink-0 border border-border/50 overflow-hidden bg-surface flex items-center justify-center">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <ImageIcon size={16} className={`text-muted/30 ${imgUrl ? "hidden" : ""}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm uppercase tracking-tight truncate">{project.title}</span>
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors shrink-0">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-xs text-muted truncate mb-2">{project.desc}</p>
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] border border-border px-2 py-0.5 uppercase tracking-tight text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
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
      </div>

      {/* Side panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={closePanel} />
          <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <h2 className="text-sm font-extrabold uppercase tracking-widest">{isNew ? "Novo Projeto" : "Editar Projeto"}</h2>
              <button onClick={closePanel} className="text-muted hover:text-accent transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {/* Upload */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Imagem do Projeto</label>
                <div
                  onClick={() => !uploading && fileRef.current?.click()}
                  className={`relative w-full aspect-video border-2 border-dashed flex items-center justify-center overflow-hidden transition-all
                    ${uploading ? "border-accent/50 cursor-wait" : "border-border hover:border-accent cursor-pointer"}`}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted">
                      <Upload size={24} />
                      <span className="text-[10px] uppercase tracking-widest">Clique para selecionar</span>
                      <span className="text-[9px] text-muted/50">JPG, PNG, WebP</span>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-accent uppercase tracking-widest">Enviando para Cloudinary...</span>
                    </div>
                  )}

                  {previewUrl && !uploading && (
                    <div className="absolute inset-0 bg-background/0 hover:bg-background/50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-[10px] text-white uppercase tracking-widest bg-accent px-3 py-2 flex items-center gap-2">
                        <Upload size={12} /> Trocar imagem
                      </span>
                    </div>
                  )}
                </div>

                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* Título */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Título *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nome do projeto"
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm" />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Descrição *</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Descreva o projeto..." rows={3}
                  className="w-full bg-transparent border border-border p-4 focus:border-accent focus:outline-none transition-colors text-sm resize-none" />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Link *</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm" />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted flex items-center gap-2">
                  <Tag size={10} /> Tags <span className="opacity-50">(separadas por vírgula)</span>
                </label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Node.js, Tailwind"
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm" />
                {tagsInput && (
                  <div className="flex gap-1 flex-wrap pt-1">
                    {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="text-[10px] border border-accent/40 text-accent px-2 py-0.5 uppercase">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{error}</p>}
            </div>

            <div className="px-8 py-6 border-t border-border flex gap-3">
              <button onClick={closePanel} className="flex-1 py-3 border border-border text-xs font-bold uppercase tracking-widest hover:border-muted transition-all">
                Cancelar
              </button>
              <button onClick={handleSave}
                disabled={saving || uploading || !form.title || !form.desc || !form.link}
                className="flex-1 py-3 bg-accent text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
                <Save size={13} /> {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
