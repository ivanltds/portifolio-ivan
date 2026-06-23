import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, LogOut, ExternalLink, Tag } from "lucide-react";

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  image: string;
}

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  desc: "",
  link: "",
  tags: [],
  image: "",
};

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    setForm(EMPTY_PROJECT);
    setTagsInput("");
    setEditing(null);
    setIsNew(true);
  };

  const openEdit = (p: Project) => {
    setForm({ title: p.title, desc: p.desc, link: p.link, tags: p.tags, image: p.image });
    setTagsInput(p.tags.join(", "));
    setEditing(p);
    setIsNew(false);
  };

  const closePanel = () => { setEditing(null); setIsNew(false); setError(""); };

  const handleSave = async () => {
    setSaving(true);
    setError("");
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-4">
          <a href="/" className="font-extrabold text-xl tracking-tighter text-accent">IS.</a>
          <span className="text-[10px] text-muted uppercase tracking-[4px] hidden sm:block">Admin Panel</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <LogOut size={14} /> Sair
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        {/* Title row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-[4px] block mb-2">Portfólio</span>
            <h1 className="text-3xl font-extrabold tracking-tighter">Aplicações em Produção</h1>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-accent text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            <Plus size={14} /> Novo Projeto
          </button>
        </div>

        {error && !panelOpen && (
          <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-6">{error}</p>
        )}

        {/* Projects list */}
        {loading ? (
          <div className="text-xs text-muted uppercase tracking-widest animate-pulse">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-5 border border-border bg-background hover:border-accent/40 transition-all group"
              >
                {/* Image preview */}
                <div className="w-16 h-12 shrink-0 border border-border/50 overflow-hidden bg-surface">
                  <img
                    src={`https://res.cloudinary.com/dqt35bpzt/image/upload/f_auto,q_auto/portfolio/ivan/${project.image.split(".")[0]}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
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
                      <span key={tag} className="text-[10px] border border-border px-2 py-0.5 uppercase tracking-tight text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-2 border border-border hover:border-accent hover:text-accent transition-all"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-2 border border-border hover:border-red-500 hover:text-red-500 transition-all"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border">
                <p className="text-xs text-muted uppercase tracking-widest">Nenhum projeto cadastrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Side panel — add/edit */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={closePanel} />

          {/* Panel */}
          <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <h2 className="text-sm font-extrabold uppercase tracking-widest">
                {isNew ? "Novo Projeto" : "Editar Projeto"}
              </h2>
              <button onClick={closePanel} className="text-muted hover:text-accent transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nome do projeto"
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Descrição *</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Descreva o projeto..."
                  rows={3}
                  className="w-full bg-transparent border border-border p-4 focus:border-accent focus:outline-none transition-colors text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Link *</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted flex items-center gap-2">
                  <Tag size={10} /> Tags <span className="opacity-50">(separadas por vírgula)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Node.js, Tailwind"
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm"
                />
                {tagsInput && (
                  <div className="flex gap-1 flex-wrap pt-1">
                    {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="text-[10px] border border-accent/40 text-accent px-2 py-0.5 uppercase">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">
                  Imagem (nome no Cloudinary)
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="portfolio-meu-projeto.jpg"
                  className="w-full bg-transparent border-b border-border py-3 focus:border-accent focus:outline-none transition-colors text-sm"
                />
                <p className="text-[10px] text-muted">
                  Faça upload no Cloudinary na pasta <code className="text-accent">portfolio/ivan</code> e coloque o nome do arquivo aqui.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{error}</p>
              )}
            </div>

            <div className="px-8 py-6 border-t border-border flex gap-3">
              <button
                onClick={closePanel}
                className="flex-1 py-3 border border-border text-xs font-bold uppercase tracking-widest hover:border-muted transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.desc || !form.link}
                className="flex-1 py-3 bg-accent text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Save size={13} /> {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
