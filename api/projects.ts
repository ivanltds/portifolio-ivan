import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../data/projects.json");

export default function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const { projects } = JSON.parse(raw);
    return res.json({ projects });
  } catch {
    return res.status(500).json({ error: "Erro ao ler projetos" });
  }
}
