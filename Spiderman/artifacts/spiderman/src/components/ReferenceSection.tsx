import { useEffect, useRef, useState } from "react";
import "./ReferenceSection.css";

const CHIPS = ["ACTION", "ADVENTURE", "SCI-FI", "MARVEL", "2021"];

const CARDS = [
  {
    title: "MULTIVERSE",
    subtitle: "OPENED",
    text: "Doctor Strange's spell goes wrong, opening the multiverse to villains from other realities.",
  },
  {
    title: "THREE",
    subtitle: "SPIDER-MEN",
    text: "Tobey Maguire, Andrew Garfield, and Tom Holland team up for the first time.",
  },
  {
    title: "VILLAIN",
    subtitle: "RETURN",
    text: "Green Goblin, Doctor Octopus, Electro, Lizard, and Sandman return from the past.",
  },
];

export default function ReferenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`reference-section ${visible ? "visible" : ""}`} ref={sectionRef} id="story">
      <div className="ref-header">
        <div className="ref-label">THE STORY</div>
        <h2 className="ref-title">WITH GREAT POWER<br />COMES GREAT RESPONSIBILITY</h2>
        <p className="ref-description" data-testid="ref-description">
          For the first time in the cinematic history of Spider-Man, our friendly neighborhood hero's
          identity is revealed — bringing his Super Hero responsibilities into conflict with his
          normal life and putting those he cares most about at risk. When he enlists Doctor Strange's
          help to restore his secret, the spell tears a hole in their world, releasing the most
          powerful villains who've ever fought a Spider-Man in any universe.
        </p>
        <div className="ref-chips">
          {CHIPS.map((chip) => (
            <span key={chip} className="ref-chip" data-testid={`chip-${chip.toLowerCase()}`}>{chip}</span>
          ))}
        </div>
        <div className="ref-release" data-testid="ref-release">
          <span className="release-label">IN THEATERS</span>
          <span className="release-date">DECEMBER 17, 2021</span>
        </div>
      </div>

      <div className="ref-cards" data-testid="ref-cards">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="ref-card"
            style={{ animationDelay: `${i * 0.15}s` }}
            data-testid={`ref-card-${i}`}
          >
            <div className="ref-card-inner">
              <div className="ref-card-number">0{i + 1}</div>
              <div className="ref-card-title">{card.title}</div>
              <div className="ref-card-subtitle">{card.subtitle}</div>
              <p className="ref-card-text">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <blockquote className="ref-quote" data-testid="ref-quote">
        <span className="quote-mark">"</span>
        <p>If you expect disappointment, then you can never really be disappointed.</p>
        <cite>— MJ</cite>
      </blockquote>
    </section>
  );
}
