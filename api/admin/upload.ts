import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// Vercel: aumenta limite do body para uploads
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
  if (!verifyToken(req)) return res.status(401).json({ error: "Não autorizado" });

  const { image, filename } = req.body || {};
  if (!image) return res.status(400).json({ error: "Imagem não enviada" });

  cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || "dqt35bpzt",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const folder = (process.env.VITE_CLOUDINARY_FOLDER || "portfolio/ivan").replace(/\/$/, "");

  // Sanitiza: remove extensão, troca qualquer caractere não-alfanumérico por hífen,
  // colapsa hífens múltiplos, remove hífens nas bordas
  const sanitizeName = (name: string) =>
    name
      .replace(/\.[^/.]+$/, "")           // remove extensão
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "") // remove acentos
      .replace(/[^a-z0-9]+/g, "-")        // qualquer coisa estranha → hífen
      .replace(/^-+|-+$/g, "")            // hífens nas bordas
      .slice(0, 60);                       // Cloudinary limita o tamanho

  const publicId = filename ? sanitizeName(filename) : undefined;

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder,
      ...(publicId && { public_id: publicId, overwrite: true }),
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    const nameWithExt = result.public_id.split("/").pop() + "." + result.format;
    return res.json({ url: result.secure_url, filename: nameWithExt });
  } catch (err: any) {
    console.error("[upload] Cloudinary error:", err.message);
    return res.status(500).json({ error: "Falha no upload: " + err.message });
  }
}
