import { lazy, Suspense, useState, useCallback } from "react";
const Hero = lazy(() => import("@/components/sections/hero").then(m => ({ default: m.Hero })));
const About = lazy(() => import("@/components/sections/about").then(m => ({ default: m.About })));
const Projects = lazy(() => import("@/components/sections/projects").then(m => ({ default: m.Projects })));
const Philosophy = lazy(() => import("@/components/sections/philosophy").then(m => ({ default: m.Philosophy })));
const Skills = lazy(() => import("@/components/sections/skills").then(m => ({ default: m.Skills })));
const Contact = lazy(() => import("@/components/sections/contact").then(m => ({ default: m.Contact })));
import { Navbar } from "@/components/layout/navbar";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { Preloader } from "@/components/preloader";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handlePreloaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <Preloader onComplete={handlePreloaderComplete} />
      <CustomCursor />
      <ScrollProgress />

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <Navbar />
        <main>
          <Suspense fallback={null}>
            <Hero />
            <About />
            <Projects />
            <Philosophy />
            <Skills />
            <Contact />
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}
