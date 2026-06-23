import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();

  // Parse body (Vercel pode não parsear automaticamente)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body) {
    // Ler stream manualmente
    body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    });
  }

  const { password } = body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  console.log("[admin/login] received password:", password);
  console.log("[admin/login] ADMIN_PASSWORD set:", !!process.env.ADMIN_PASSWORD);
  console.log("[admin/login] match:", password === ADMIN_PASSWORD);

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  const token = crypto
    .createHmac("sha256", "portfolio-admin-salt")
    .update(ADMIN_PASSWORD)
    .digest("hex");

  return res.status(200).json({ token });
}
