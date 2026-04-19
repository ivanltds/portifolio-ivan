import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  // API Routes
  app.post("/api/contact", async (req, res) => {
    const { nome, email, desafio } = req.body;

    if (!nome || !email || !desafio) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

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
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
