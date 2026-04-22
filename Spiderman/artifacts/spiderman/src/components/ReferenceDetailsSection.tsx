import { useEffect, useRef, useState } from "react";
import "./ReferenceDetailsSection.css";

const CAST_MEMBERS = [
  { name: "TOM HOLLAND", role: "Peter Parker / Spider-Man" },
  { name: "ZENDAYA", role: "MJ" },
  { name: "BENEDICT CUMBERBATCH", role: "Doctor Strange" },
  { name: "TOBEY MAGUIRE", role: "Peter Parker #2" },
  { name: "ANDREW GARFIELD", role: "Peter Parker #3" },
  { name: "WILLEM DAFOE", role: "Green Goblin" },
];

const DETAILS = [
  { label: "DIRECTOR", value: "JON WATTS" },
  { label: "WRITERS", value: "CHRIS McKENNA, ERIK SOMMERS" },
  { label: "STUDIO", value: "MARVEL STUDIOS / SONY" },
  { label: "RELEASE", value: "DECEMBER 17, 2021" },
  { label: "RUNTIME", value: "2 HOURS 28 MINUTES" },
  { label: "RATING", value: "PG-13" },
];

export default function ReferenceDetailsSection() {
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
    <section className={`ref-details-section ${visible ? "visible" : ""}`} ref={sectionRef} id="cast">
      <div className="rds-left">
        <div className="rds-label">CAST & CREW</div>
        <h2 className="rds-title">THE TEAM</h2>

        <div className="rds-cast-list" data-testid="cast-list">
          {CAST_MEMBERS.map((member, i) => (
            <div key={i} className="rds-cast-member" style={{ animationDelay: `${i * 0.1}s` }} data-testid={`cast-member-${i}`}>
              <div className="rds-avatar" aria-hidden="true">
                <span>{member.name[0]}</span>
                <div className="avatar-ring" />
              </div>
              <div className="rds-cast-info">
                <div className="rds-cast-name">{member.name}</div>
                <div className="rds-cast-role">{member.role}</div>
              </div>
              <div className="rds-arrow">↓</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rds-right">
        <div className="rds-details-card" data-testid="details-card">
          <div className="rds-details-title">FILM DETAILS</div>
          {DETAILS.map((d, i) => (
            <div key={i} className="rds-detail-row" data-testid={`detail-row-${i}`}>
              <span className="rds-detail-label">{d.label}</span>
              <span className="rds-detail-value">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="rds-booking-card" data-testid="booking-card" id="tickets">
          <div className="rds-booking-title">GET YOUR TICKETS</div>
          <p className="rds-booking-text">Experience the multiverse on the big screen. Don't miss the most anticipated Marvel event.</p>
          <a href="#" className="rds-booking-btn" data-testid="button-booking">BOOK NOW</a>
          <div className="rds-booking-platforms">
            <span>Available on all major platforms</span>
          </div>
        </div>

        <div className="rds-media-gallery" data-testid="media-gallery">
          <div className="rds-gallery-item rds-gallery-main" />
          <div className="rds-gallery-item" />
          <div className="rds-gallery-item" />
        </div>
      </div>
    </section>
  );
}
