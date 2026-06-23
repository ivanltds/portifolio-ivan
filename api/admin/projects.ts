import crypto from "crypto";
import fs from "fs";
import path from "path";

function getAdminToken(): string {
  const pass = process.env.ADMIN_PASSWORD || "admin123";
  return crypto.createHmac("sha256", "portfolio-admin-salt").update(pass).digest("hex");
}

function verifyToken(req: any): boolean {
  const auth = (req.headers["authorization"] || "") as string;
  const token = auth.replace("Bearer ", "").trim();
  return token === getAdminToken();
}

// process.cwd() aponta para a raiz do projeto no Vercel
const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function readProjects(): any[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw).projects || [];
  } catch (e) {
    console.error("[admin/projects] read error:", e);
    return [];
  }
}

function writeProjects(projects: any[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ projects }, null, 2));
}

export default function handler(req: any, res: any) {
  if (!verifyToken(req)) {
    console.log("[admin/projects] unauthorized");
    return res.status(401).json({ error: "Não autorizado" });
  }

  console.log("[admin/projects] method:", req.method);

  if (req.method === "GET") {
    const projects = readProjects();
    console.log("[admin/projects] returning", projects.length, "projects");
    return res.json({ projects });
  }

  if (req.method === "POST") {
    const projects = readProjects();
    const newProject = { ...req.body, id: Date.now().toString() };
    projects.push(newProject);
    writeProjects(projects);
    return res.status(201).json(newProject);
  }

  if (req.method === "PUT") {
    const { id } = req.params;
    const projects = readProjects();
    const idx = projects.findIndex((p: any) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Projeto não encontrado" });
    projects[idx] = { ...projects[idx], ...req.body, id };
    writeProjects(projects);
    return res.json(projects[idx]);
  }

  if (req.method === "DELETE") {
    const { id } = req.params;
    const updated = readProjects().filter((p: any) => p.id !== id);
    writeProjects(updated);
    return res.status(204).end();
  }

  return res.status(405).end();
}
