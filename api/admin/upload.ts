import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

function getAdminToken(): string {
  const pass = process.env.ADMIN_PASSWORD || "admin123";
  return crypto.createHmac("sha256", "portfolio-admin-salt").update(pass).digest("hex");
}

function verifyToken(req: any): boolean {
  const auth = (req.headers["authorization"] || "") as string;
  return auth.replace("Bearer ", "").trim() === getAdminToken();
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();
  if (!verifyToken(req)) return res.status(401).json({ error: "Nao autorizado" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || !body.image) {
    body = await new Promise<any>((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    });
  }

  const { image } = body || {};
  if (!image) return res.status(400).json({ error: "Imagem nao enviada" });

  cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || "dqt35bpzt",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const folder = (process.env.VITE_CLOUDINARY_FOLDER || "portfolio/ivan").trim().replace(/\/$/, "");

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: err.message || "Erro no upload" });
  }
}
