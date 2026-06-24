import crypto from "crypto";
import { Redis } from "@upstash/redis";

const CONTENT_KEY = "site_content";
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

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

export default async function handler(req: any, res: any) {
  if (!verifyToken(req)) return res.status(401).json({ error: "Não autorizado" });

  // Parse body
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body && req.method === "PUT") {
    body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    });
  }

  try {
    if (req.method === "GET") {
      const content = await redis.get(CONTENT_KEY);
      return res.json({ content });
    }

    if (req.method === "PUT") {
      if (!body?.content) return res.status(400).json({ error: "Conteúdo não fornecido" });
      await redis.set(CONTENT_KEY, body.content);
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err: any) {
    console.error("[admin/content] error:", err);
    return res.status(500).json({ error: "Erro interno", detail: err.message });
  }
}
