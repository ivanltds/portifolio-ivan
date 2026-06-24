import { Redis } from "@upstash/redis";

const CONTENT_KEY = "site_content";

export default async function handler(req: any, res: any) {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    const raw = await redis.get<any>(CONTENT_KEY);
    const url: string | undefined = raw?.content?.seo?.ogImageUrl;

    if (url && url.startsWith("http")) {
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return res.redirect(302, url);
    }
  } catch (e) {
    console.error("api/og error:", e);
  }

  // fallback: imagem no Cloudinary (subir manualmente se necessário)
  return res.redirect(302, "https://portifolio-ivan.vercel.app/ivan-hero.jpg");
}
