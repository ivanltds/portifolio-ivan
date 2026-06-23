import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../../data/projects.json");

function readProjects(): any[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw).projects;
}

function writeProjects(projects: any[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ projects }, null, 2));
}

export default function handler(req: any, res: any) {
  if (!verifyToken(req)) return res.status(401).json({ error: "Não autorizado" });

  if (req.method === "GET") {
    return res.json({ projects: readProjects() });
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
