import { useEffect, useRef, useState } from "react";
import "./BottomPlaceholderSection.css";

const STATS = [
  { value: "$1.9B", label: "WORLDWIDE BOX OFFICE" },
  { value: "97%", label: "ROTTEN TOMATOES" },
  { value: "3", label: "SPIDER-MEN" },
  { value: "5", label: "MULTIVERSE VILLAINS" },
];

export default function BottomPlaceholderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`bottom-section ${visible ? "visible" : ""}`} ref={sectionRef}>
      <div className="bs-stats-band" data-testid="stats-band">
        {STATS.map((stat, i) => (
          <div key={i} className="bs-stat" data-testid={`stat-${i}`}>
            <div className="bs-stat-value">{stat.value}</div>
            <div className="bs-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bs-final-cta">
        <div className="bs-final-bg" aria-hidden="true">
          <div className="bs-web-pattern" />
        </div>
        <div className="bs-final-content">
          <div className="bs-final-label">EXPERIENCE THE MULTIVERSE</div>
          <h2 className="bs-final-title">THE ADVENTURE<br />OF A LIFETIME</h2>
          <p className="bs-final-text">
            Now available on all streaming platforms and on Blu-ray. Relive the most
            epic Spider-Man story ever told.
          </p>
          <div className="bs-final-actions" data-testid="final-actions">
            <a href="#" className="bs-btn-primary" data-testid="button-stream">STREAM NOW</a>
            <a href="#" className="bs-btn-secondary" data-testid="button-bluray">BLU-RAY</a>
          </div>
        </div>
      </div>

      <footer className="bs-footer" data-testid="footer">
        <div className="bs-footer-logo">SPIDEY</div>
        <div className="bs-footer-copy">
          © 2021 MARVEL STUDIOS / COLUMBIA PICTURES. ALL RIGHTS RESERVED.
        </div>
        <div className="bs-footer-links">
          <a href="#" className="bs-footer-link" data-testid="link-privacy">PRIVACY</a>
          <a href="#" className="bs-footer-link" data-testid="link-terms">TERMS</a>
          <a href="#" className="bs-footer-link" data-testid="link-contact">CONTACT</a>
        </div>
      </footer>
    </section>
  );
}
