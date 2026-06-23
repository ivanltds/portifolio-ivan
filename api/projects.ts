import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const KV_KEY = "projects";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Tenta Redis primeiro
    if (process.env.KV_REST_API_URL) {
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN!,
      });
      const projects = await redis.get<any[]>(KV_KEY);
      if (projects && projects.length > 0) {
        return res.json({ projects });
      }
    }

    // Fallback: lê do arquivo JSON (desenvolvimento local ou KV vazio)
    const DATA_FILE = path.join(process.cwd(), "data", "projects.json");
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const { projects } = JSON.parse(raw);
    return res.json({ projects });
  } catch (e) {
    console.error("[projects] read error:", e);
    return res.status(500).json({ error: "Erro ao ler projetos" });
  }
}
