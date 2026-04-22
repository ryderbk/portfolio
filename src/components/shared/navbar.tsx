import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Briefcase, User, Wrench, Mail, Maximize } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const navLinks = [
  { name: "Work", href: "#work", icon: Briefcase },
  { name: "About", href: "#about", icon: User },
  { name: "Skills", href: "#skills", icon: Wrench },
  { name: "Contact", href: "#contact", icon: Mail },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const { config, updateConfig } = useSiteConfig();
  
  // Resolve current actual theme based on config or system preference
  const isDark = config.themeMode === "dark" || 
    (config.themeMode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          const sections = navLinks.map(l => l.href.slice(1));
          for (const id of [...sections].reverse()) {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 120) {
              setActive(id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => updateConfig({ themeMode: isDark ? "light" : "dark" });
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
          scrolled
            ? "glass-nav border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <button
            className="interactive group flex items-center gap-1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="btn-logo"
            aria-label="Scroll to top"
          >
            <span className="font-display text-lg font-bold tracking-tighter group-hover:opacity-60 transition-opacity duration-200">
              BK
            </span>
            <span className="text-muted-foreground font-sans text-xs ml-2 hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Portfolio
            </span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center p-1.5 rounded-2xl gap-1 backdrop-blur-xl backdrop-saturate-150 bg-background/80 border border-border/50" style={{ boxShadow: 'var(--base-shadow)' }}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                className="interactive nav-pill group"
                onClick={() => scrollTo(link.href)}
                data-active={active === link.href.slice(1)}
                data-testid={`nav-${link.name.toLowerCase()}`}
                aria-label={`Navigate to ${link.name}`}
                aria-current={active === link.href.slice(1) ? "true" : undefined}
              >
                <span className="nav-pill-icon" aria-hidden="true">
                  <link.icon size={18} />
                </span>
                <span className="nav-pill-title">
                  {link.name}
                </span>
              </button>
            ))}

            <div className="w-px h-6 bg-border mx-2" aria-hidden="true" />

            <button
              onClick={toggleFullscreen}
              className="interactive w-[40px] h-[40px] flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
              aria-label="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className="interactive w-[40px] h-[40px] flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
              data-testid="btn-theme-toggle"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="interactive p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle Fullscreen"
            >
              <Maximize size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className="interactive p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="interactive p-2"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              data-testid="btn-mobile-menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'hsl(var(--background))' }}
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-border">
              <span className="font-display font-bold">BK</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="interactive p-2"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-6" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="border-b border-border last:border-0"
                >
                  <button
                    className="interactive w-full text-left py-6 text-4xl font-display font-semibold tracking-tight hover:text-accent transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => scrollTo(link.href), 350);
                    }}
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </nav>
            <div className="px-6 py-8 text-sm text-muted-foreground font-sans">
              sbharathkumar1125@gmail.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
