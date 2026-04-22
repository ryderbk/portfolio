import { useEffect, useRef, useState } from "react";
import "./DeadpoolPosterSection.css";

const MULTIVERSE_SPIDERMEN = [
  {
    id: "tobey",
    number: "EARTH-96283",
    name: "TOBEY MAGUIRE",
    film: "Spider-Man Trilogy (2002–2007)",
    color: "#1e3a8a",
  },
  {
    id: "andrew",
    number: "EARTH-120703",
    name: "ANDREW GARFIELD",
    film: "The Amazing Spider-Man (2012–2014)",
    color: "#1e3a8a",
  },
  {
    id: "tom",
    number: "EARTH-199999",
    name: "TOM HOLLAND",
    film: "MCU Spider-Man (2016–Present)",
    color: "#dc1e1e",
  },
];

export default function DeadpoolPosterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`deadpool-section ${visible ? "visible" : ""}`} ref={sectionRef}>
      <div className="dp-header">
        <div className="dp-label">THE MULTIVERSE</div>
        <h2 className="dp-title">THREE WORLDS,<br />ONE MISSION</h2>
        <p className="dp-description">
          For the first time ever, three Spider-Men from different universes unite to save
          the world. Each brings their own experience, loss, and strength to the battle.
        </p>
      </div>

      <div className="dp-cards" data-testid="dp-cards">
        {MULTIVERSE_SPIDERMEN.map((spider, i) => (
          <div
            key={spider.id}
            className={`dp-card ${i === active ? "dp-card--active" : ""}`}
            onClick={() => setActive(i)}
            style={{ borderColor: i === active ? spider.color : "transparent" }}
            data-testid={`dp-card-${spider.id}`}
          >
            <div className="dp-card-bg" style={{ background: `linear-gradient(135deg, ${spider.color}22, #1a1a1a)` }} />
            <div className="dp-card-content">
              <div className="dp-earth" style={{ color: spider.color }}>{spider.number}</div>
              <div className="dp-spider-icon" aria-hidden="true">
                <svg viewBox="0 0 60 60" width="60" height="60">
                  <ellipse cx="30" cy="14" rx="10" ry="12" fill={spider.color} />
                  <path d="M20 24 Q30 18 40 24 L44 50 Q30 56 16 50 Z" fill={spider.color} />
                  <path d="M30 24 L30 50" stroke="rgba(0,0,100,0.4)" strokeWidth="1.5" />
                  <ellipse cx="25" cy="13" rx="5" ry="6" fill="white" opacity="0.8" />
                  <ellipse cx="35" cy="13" rx="5" ry="6" fill="white" opacity="0.8" />
                  <path d="M20 24 L8 38 L4 32" stroke={spider.color} strokeWidth="4" strokeLinecap="round" />
                  <path d="M40 24 L52 38 L56 32" stroke={spider.color} strokeWidth="4" strokeLinecap="round" />
                  <path d="M16 50 L10 60" stroke={spider.color} strokeWidth="4" strokeLinecap="round" />
                  <path d="M44 50 L50 60" stroke={spider.color} strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="dp-name">{spider.name}</div>
              <div className="dp-film">{spider.film}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dp-verse-info" data-testid="verse-info">
        <div className="dp-verse-label">SELECTED UNIVERSE</div>
        <div className="dp-verse-name">{MULTIVERSE_SPIDERMEN[active].name}</div>
        <div className="dp-verse-film">{MULTIVERSE_SPIDERMEN[active].film}</div>
      </div>
    </section>
  );
}
