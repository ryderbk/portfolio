import { useEffect, useRef, useState } from "react";
import "./SpiderManHero.css";

const CAST_TAGS = [
  { name: "TOBEY MAGUIRE", size: "40px", color: "#dc1e1e" },
  { name: "ANDREW GARFIELD", size: "40px", color: "#dc1e1e" },
  { name: "TOM HOLLAND", size: "40px", color: "#dc1e1e" },
  { name: "ZENDAYA", size: "40px", color: "#dc1e1e" },
  { name: "BENEDICT CUMBERBATCH", size: "22px", color: "#ffffff" },
  { name: "ALFRED MOLINA", size: "18px", color: "rgba(255,255,255,0.8)" },
  { name: "JAMIE FOXX", size: "18px", color: "rgba(255,255,255,0.8)" },
  { name: "WILLEM DAFOE", size: "18px", color: "rgba(255,255,255,0.8)" },
];

export default function SpiderManHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;

  return (
    <section className="spiderman-hero" id="hero" ref={heroRef}>
      <div className="hero-bg" style={{ transform: `translateY(${parallaxOffset}px)` }}>
        <div className="hero-bg-gradient" />
        <div className="hero-web-lines">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`web-line web-line-${i}`} />
          ))}
        </div>
      </div>

      <div className="hero-content">
        <nav className="hero-nav">
          <div className="hero-logo" data-testid="hero-logo">SPIDEY</div>
          <div className="hero-nav-links">
            <a href="#story" className="hero-nav-link">STORY</a>
            <a href="#cast" className="hero-nav-link">CAST</a>
            <a href="#tickets" className="hero-nav-link" data-testid="link-tickets">GET TICKETS</a>
          </div>
        </nav>

        <div className="hero-main">
          <div className="hero-subtitle" data-testid="hero-subtitle">MARVEL STUDIOS PRESENTS</div>
          <h1 className="hero-title" data-testid="hero-title">
            <span className="hero-title-spider">SPIDER-MAN</span>
            <span className="hero-title-no">NO WAY</span>
            <span className="hero-title-home">HOME</span>
          </h1>

          <div className="hero-cast-tags" id="cast" data-testid="hero-cast-tags">
            {CAST_TAGS.map((tag) => (
              <span
                key={tag.name}
                className="cast-tag"
                style={{ fontSize: tag.size, color: tag.color }}
                data-testid={`cast-tag-${tag.name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="hero-meta" data-testid="hero-meta">
            <span className="hero-rating">PG-13</span>
            <span className="hero-separator">•</span>
            <span className="hero-duration">2H 28M</span>
            <span className="hero-separator">•</span>
            <span className="hero-genre">ACTION / ADVENTURE / SCI-FI</span>
          </div>

          <div className="hero-cta" data-testid="hero-cta">
            <a href="#tickets" className="cta-button primary" data-testid="button-book-tickets">
              BOOK NOW
            </a>
            <a href="#story" className="cta-button secondary" data-testid="button-watch-trailer">
              WATCH TRAILER
            </a>
          </div>
        </div>

        <div className="hero-spiderman-silhouette" aria-hidden="true">
          <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="150" cy="70" rx="45" ry="55" fill="#dc1e1e" />
            <ellipse cx="150" cy="70" rx="35" ry="38" fill="#1a1a1a" opacity="0.3" />
            <path d="M105 120 Q150 100 195 120 L220 280 Q150 310 80 280 Z" fill="#dc1e1e" />
            <path d="M150 120 L150 280" stroke="#0a0a60" strokeWidth="2" opacity="0.5" />
            <path d="M105 160 L195 160" stroke="#0a0a60" strokeWidth="2" opacity="0.5" />
            <path d="M105 120 L60 200 L40 180" stroke="#dc1e1e" strokeWidth="8" strokeLinecap="round" />
            <path d="M195 120 L240 200 L260 180" stroke="#dc1e1e" strokeWidth="8" strokeLinecap="round" />
            <path d="M80 280 L60 380" stroke="#dc1e1e" strokeWidth="8" strokeLinecap="round" />
            <path d="M220 280 L240 380" stroke="#dc1e1e" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="135" cy="65" rx="14" ry="16" fill="white" opacity="0.9" />
            <ellipse cx="165" cy="65" rx="14" ry="16" fill="white" opacity="0.9" />
            <path d="M105 70 Q150 50 195 70" stroke="#0a0a60" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
