import crypto from "crypto";

export function getAdminToken(): string {
  const pass = process.env.ADMIN_PASSWORD || "admin123";
  return crypto.createHmac("sha256", "portfolio-admin-salt").update(pass).digest("hex");
}

export function verifyToken(req: any): boolean {
  const auth = (req.headers["authorization"] || "") as string;
  const token = auth.replace("Bearer ", "").trim();
  return token === getAdminToken();
}
