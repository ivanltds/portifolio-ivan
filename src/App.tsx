/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCloudinaryImages } from "./hooks/useCloudinaryImages";
import { SiteContentProvider } from "./context/SiteContentContext";
import CookieBanner from "./components/CookieBanner";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import MethodSection from "./components/MethodSection";
import FaqSection from "./components/FaqSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function App() {
  const { getCldUrl } = useCloudinaryImages();

  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white overflow-x-hidden">
        <Sidebar />
        <div className="lg:pl-20">
          <Navbar />
          <HeroSection getCldUrl={getCldUrl} />
          <AboutSection getCldUrl={getCldUrl} />
          <ExperienceSection />
          <PortfolioSection getCldUrl={getCldUrl} />
          <ServicesSection />
          <MethodSection />
          <FaqSection />
          <TestimonialsSection />
          <ContactSection />
          <CtaSection />
          <Footer />

        </div>
      </div>
      <CookieBanner />
      <Analytics />
    </SiteContentProvider>
  );
}
