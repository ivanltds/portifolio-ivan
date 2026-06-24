import { Resend } from "resend";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // sem chave configurada, deixa passar (dev local)

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }
  if (!body || !body.nome) {
    body = await new Promise<any>((resolve) => {
      let data = "";
      req.on("data", (chunk: any) => (data += chunk));
      req.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    });
  }

  const { nome, email, desafio, _to, _turnstile } = body;

  if (!nome || !email || !desafio) {
    return res.status(400).json({ error: "Todos os campos sao obrigatorios." });
  }

  // Verifica token Turnstile
  if (_turnstile) {
    const valid = await verifyTurnstile(_turnstile);
    if (!valid) {
      return res.status(400).json({ error: "Verificacao de seguranca falhou. Tente novamente." });
    }
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (!resend) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(500).json({ error: "Servico de e-mail nao configurado." });
  }

  const toEmail = _to || "ivanltds@gmail.com";

  try {
    const { data, error } = await resend.emails.send({
      from: "Consultoria Ivan Souza <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Novo Contato de Diagnostico: ${nome}`,
      html: `
        <h1>Novo Contato via Landing Page</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Desafio Tecnico:</strong></p>
        <p>${desafio}</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(400).json({ error: "Erro ao enviar e-mail." });
    }

    res.status(200).json({ message: "Mensagem enviada com sucesso!", id: data?.id });
  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({ error: "Ocorreu um erro interno." });
  }
}
