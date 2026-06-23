import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

export default function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const { projects } = JSON.parse(raw);
    return res.json({ projects });
  } catch (e) {
    console.error("[projects] read error:", e);
    return res.status(500).json({ error: "Erro ao ler projetos" });
  }
}
