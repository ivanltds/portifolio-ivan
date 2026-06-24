import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import { restoreConsent } from "./components/CookieBanner";

// Restaura o consentimento de cookies salvo antes de qualquer evento GA4
restoreConsent();

function Root() {
  const isAdmin = window.location.pathname.startsWith("/admin");

  if (!isAdmin) return <App />;

  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  return <AdminDashboard onLogout={() => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
