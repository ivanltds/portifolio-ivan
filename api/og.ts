import { Redis } from "@upstash/redis";

const CONTENT_KEY = "site_content";
const FALLBACK = "https://res.cloudinary.com/dqt35bpzt/image/upload/v1782326120/portfolio/ivan/giq9xjye3qadpe1lxmm5.jpg";

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

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return res.redirect(302, FALLBACK);
}
