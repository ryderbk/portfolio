import { lazy, Suspense, useState } from "react";
const Hero = lazy(() => import("@/components/sections/hero").then(m => ({ default: m.Hero })));
const About = lazy(() => import("@/components/sections/about").then(m => ({ default: m.About })));
const Projects = lazy(() => import("@/components/sections/projects").then(m => ({ default: m.Projects })));
const KeyboardSection = lazy(() => import("@/components/sections/keyboard-section").then(m => ({ default: m.KeyboardSection })));
const Skills = lazy(() => import("@/components/sections/skills").then(m => ({ default: m.Skills })));
const Contact = lazy(() => import("@/components/sections/contact").then(m => ({ default: m.Contact })));
import { Navbar } from "@/components/shared/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { Background } from "@/components/background";

export default function Home() {

  // Automatic fullscreen on first interaction
  useState(() => {
    const handleInteraction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Silent fail if browser blocks it or user denies
        });
      }
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("click", handleInteraction);
      window.addEventListener("touchstart", handleInteraction);
    }
  });

  return (
    <>
      <Background />
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <ScrollProgress />

      <Navbar />
      <main id="main-content">
        <Suspense fallback={null}>
          <Hero />
          <Projects />
          <About />
          <KeyboardSection />
          <Skills />
          <Contact />
        </Suspense>
      </main>
    </>
  );
}
