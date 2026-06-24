import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import { restoreConsent } from "./components/CookieBanner";


Sentry.init({
  dsn: "https://964d74fa8e8bc8f15131aebdfad48e9d@o4511621548015616.ingest.us.sentry.io/4511621553520640",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
});

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
