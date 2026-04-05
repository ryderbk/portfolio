import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Briefcase, User, Wrench, Mail } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { name: "About", href: "#about", icon: User },
  { name: "Work", href: "#work", icon: Briefcase },
  { name: "Skills", href: "#skills", icon: Wrench },
  { name: "Contact", href: "#contact", icon: Mail },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
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

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <button
            className="interactive group flex items-center gap-1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="btn-logo"
          >
            <span className="font-mono text-lg font-bold tracking-tighter group-hover:opacity-60 transition-opacity duration-200">
              BK
            </span>
            <span className="text-muted-foreground font-mono text-xs ml-2 hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Portfolio
            </span>
          </button>

          {/* Expanding Desktop Slide Menu */}
          <div className="hidden md:flex items-center p-1.5 bg-background shadow-sm rounded-2xl gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                className="interactive nav-pill group"
                onClick={() => scrollTo(link.href)}
                data-active={active === link.href.slice(1)}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                <span className="nav-pill-icon">
                  <link.icon size={20} />
                </span>
                <span className="nav-pill-title">
                  {link.name}
                </span>
              </button>
            ))}
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="interactive w-[44px] h-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
              data-testid="btn-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="interactive p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="interactive p-2"
              aria-label="Open menu"
              data-testid="btn-mobile-menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-border">
              <span className="font-mono font-bold">BK</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="interactive p-2"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="border-b border-border last:border-0"
                >
                  <button
                    className="interactive w-full text-left py-6 text-4xl font-serif font-medium tracking-tight hover:text-muted-foreground transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => scrollTo(link.href), 350);
                    }}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </nav>
            <div className="px-6 py-8 text-sm text-muted-foreground font-mono">
              sbharathkumar1125@gmail.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
