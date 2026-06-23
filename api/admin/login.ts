import { getAdminToken } from "./auth";

export default function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  return res.status(200).json({ token: getAdminToken() });
}
