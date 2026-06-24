import { Redis } from "@upstash/redis";

const CONTENT_KEY = "site_content";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    if (process.env.KV_REST_API_URL) {
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN!,
      });
      const content = await redis.get(CONTENT_KEY);
      if (content) return res.json({ content });
    }
  } catch {
    // fallback: client usa defaultContent
  }

  return res.json({ content: null });
}
