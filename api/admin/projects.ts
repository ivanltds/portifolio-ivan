import crypto from "crypto";
import { Redis } from "@upstash/redis";

const KV_KEY = "projects";
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FrameType = "none" | "phone" | "desktop";

interface ProjectImage {
  url: string;
  frame: FrameType;
}

interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  images: (string | ProjectImage)[];  // suporta string (legado) e objeto {url, frame}
  image?: string;                      // legado
  frameType?: FrameType;               // legado — substituído por frame por foto
}

// Normaliza imagens antigas (string → objeto)
function normalizeImages(images: (string | ProjectImage)[]): ProjectImage[] {
  return images.map((img) =>
    typeof img === "string" ? { url: img, frame: "none" } : img
  );
}

// ─── Auth inline ──────────────────────────────────────────────────────────────
function makeToken(password: string) {
  return crypto
    .createHmac("sha256", "portfolio-admin-salt")
    .update(password)
    .digest("hex");
}

function verifyToken(req: any): boolean {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const expected = makeToken(ADMIN_PASSWORD);
  const auth = req.headers["authorization"] || "";
  const token = auth.replace("Bearer ", "").trim();
  return token === expected;
}

// ─── Normaliza projetos antigos ───────────────────────────────────────────────
function normalize(p: any): Project {
  let images = p.images || [];
  if (images.length === 0 && p.image) images = [p.image];
  return { ...p, images: normalizeImages(images) };
}

// ─── KV helpers ─────────────────────────────────────────────────────────────
async function getAll(): Promise<Project[]> {
  const raw = await redis.get<any[]>(KV_KEY);
  return (raw || []).map(normalize);
}

async function saveAll(projects: Project[]) {
  await redis.set(KV_KEY, projects);
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  if (!verifyToken(req)) return res.status(401).json({ error: "Nao autorizado" });

  // GET — lista todos
  if (req.method === "GET") {
    const projects = await getAll();
    return res.json({ projects });
  }

  // Parseia body
  let body = req.body;
  if (!body || typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }
  if (!body || !body.title) {
    body = await new Promise<any>((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    });
  }

  // POST — cria
  if (req.method === "POST") {
    const projects = await getAll();
    const newProject: Project = {
      id: Date.now().toString(),
      title: body.title || "",
      desc: body.desc || "",
      link: body.link || "",
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      images: normalizeImages(body.images || []),
    };
    projects.push(newProject);
    await saveAll(projects);
    return res.json({ project: newProject });
  }

  // PUT — atualiza
  if (req.method === "PUT") {
    const id = req.query?.id || (req.url?.split("?id=")[1]);
    if (!id) return res.status(400).json({ error: "ID obrigatorio" });
    const projects = await getAll();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Projeto nao encontrado" });
    projects[idx] = {
      ...projects[idx],
      title: body.title ?? projects[idx].title,
      desc: body.desc ?? projects[idx].desc,
      link: body.link ?? projects[idx].link,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      images: body.images ? normalizeImages(body.images) : projects[idx].images,
    };
    await saveAll(projects);
    return res.json({ project: projects[idx] });
  }

  // DELETE
  if (req.method === "DELETE") {
    const id = req.query?.id || (req.url?.split("?id=")[1]);
    if (!id) return res.status(400).json({ error: "ID obrigatorio" });
    const projects = await getAll();
    const filtered = projects.filter((p) => p.id !== id);
    await saveAll(filtered);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
