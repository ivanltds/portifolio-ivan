import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const KV_KEY = "projects";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    if (process.env.KV_REST_API_URL) {
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN!,
      });
      const projects = await redis.get<any[]>(KV_KEY);
      if (projects) return res.json({ projects });
    }

    // Fallback: arquivo local
    const filePath = path.join(process.cwd(), "data", "projects.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return res.json({ projects: data });
    }

    return res.json({ projects: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
