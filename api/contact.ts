import { Resend } from "resend";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nome, email, desafio } = req.body;

  if (!nome || !email || !desafio) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (!resend) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(500).json({ error: "Serviço de e-mail não configurado." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Consultoria Ivan Souza <onboarding@resend.dev>",
      to: ["ivanltds@gmail.com"],
      subject: `Novo Contato de Diagnóstico: ${nome}`,
      html: `
        <h1>Novo Contato via Landing Page</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Desafio Técnico:</strong></p>
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
