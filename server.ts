import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import contactHandler from "./api/contact";
import imagesHandler from "./api/images";
import projectsHandler from "./api/projects";
import loginHandler from "./api/admin/login";
import adminProjectsHandler from "./api/admin/projects";
import uploadHandler from "./api/admin/upload";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Public API
  app.post("/api/contact", contactHandler);
  app.get("/api/images", imagesHandler);
  app.get("/api/projects", projectsHandler);

  // Admin API
  app.post("/api/admin/login", loginHandler);
  app.get("/api/admin/projects", adminProjectsHandler);
  app.post("/api/admin/projects", adminProjectsHandler);
  app.put("/api/admin/projects", adminProjectsHandler);
  app.delete("/api/admin/projects", adminProjectsHandler);
  app.post("/api/admin/upload", uploadHandler);

  // Vite middleware
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
