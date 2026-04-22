import { useState } from "react";
import "./Navigation.css";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <div className="nav-logo-text">SPIDEY</div>
      </div>
      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <a href="#hero" className="nav-item">HOME</a>
        <a href="#story" className="nav-item">STORY</a>
        <a href="#cast" className="nav-item">CAST</a>
        <a href="#tickets" className="nav-item">TICKETS</a>
      </div>
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
