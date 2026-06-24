import { Redis } from "@upstash/redis";

const CONTENT_KEY = "site_content";
const FALLBACK = "https://portifolio-ivan.vercel.app/ivan-hero.jpg";

export default async function handler(req: any, res: any) {
  let imageUrl = FALLBACK;

  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    const raw = await redis.get<{ content?: { seo?: { ogImageUrl?: string } } }>(CONTENT_KEY);
    if (raw?.content?.seo?.ogImageUrl) {
      imageUrl = raw.content.seo.ogImageUrl;
    }
  } catch {
    // usa fallback
  }

  try {
    const upstream = await fetch(imageUrl);
    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(Buffer.from(buffer));
  } catch {
    res.redirect(302, FALLBACK);
  }
}
