import crypto from "crypto";
import { Redis } from "@upstash/redis";

const KV_KEY = "projects";
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  desc: string;
  link: string;
  tags: string[];
  image: string;
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

// ─── KV helpers ───────────────────────────────────────────────────────────────
async function readProjects(): Promise<Project[]> {
  const data = await redis.get<Project[]>(KV_KEY);
  return data || [];
}

async function writeProjects(projects: Project[]): Promise<void> {
  await redis.set(KV_KEY, projects);
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  if (!verifyToken(req)) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  // Parsear body se necessário
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body && req.method !== "GET" && req.method !== "DELETE") {
    body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    });
  }

  const urlParts = req.url?.split("/").filter(Boolean) || [];
  const idFromUrl = urlParts[urlParts.length - 1];
  const hasId = idFromUrl && idFromUrl !== "projects";

  try {
    // GET /api/admin/projects
    if (req.method === "GET" && !hasId) {
      const projects = await readProjects();
      return res.status(200).json({ projects });
    }

    // POST /api/admin/projects
    if (req.method === "POST") {
      const projects = await readProjects();
      const newProject: Project = {
        id: Date.now().toString(),
        title: body.title || "",
        desc: body.desc || "",
        link: body.link || "",
        tags: Array.isArray(body.tags) ? body.tags : [],
        image: body.image || "",
      };
      projects.push(newProject);
      await writeProjects(projects);
      return res.status(201).json({ project: newProject });
    }

    // PUT /api/admin/projects/:id
    if (req.method === "PUT" && hasId) {
      const projects = await readProjects();
      const idx = projects.findIndex((p) => p.id === idFromUrl);
      if (idx === -1) return res.status(404).json({ error: "Projeto não encontrado" });
      projects[idx] = {
        ...projects[idx],
        title: body.title ?? projects[idx].title,
        desc: body.desc ?? projects[idx].desc,
        link: body.link ?? projects[idx].link,
        tags: Array.isArray(body.tags) ? body.tags : projects[idx].tags,
        image: body.image ?? projects[idx].image,
      };
      await writeProjects(projects);
      return res.status(200).json({ project: projects[idx] });
    }

    // DELETE /api/admin/projects/:id
    if (req.method === "DELETE" && hasId) {
      const projects = await readProjects();
      const filtered = projects.filter((p) => p.id !== idFromUrl);
      await writeProjects(filtered);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err: any) {
    console.error("[admin/projects] KV error:", err);
    return res.status(500).json({ error: "Erro interno", detail: err.message });
  }
}
