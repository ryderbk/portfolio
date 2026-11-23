import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { Magnetic } from "@/components/cinema/Magnetic";
import { Arrow } from "./hero";

const EMAIL = "sbharathkumar1125@gmail.com";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".c-cta-title .c-line-in", {
        yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.12,
        scrollTrigger: { trigger: ".c-cta-title", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form };
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    try {
      const { sendMessage } = await import("@/services/firestore");
      await sendMessage(data);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Something went wrong. Please try again later.");
      setSent(false);
    }
  }
  const set = (k: keyof typeof form) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <section ref={root} id="contact" className="c-contact" aria-label="Contact">
      <div className="c-wrap">
        <span className="mono c-eyebrow" style={{ marginBottom: "2rem" }}>04 — Contact</span>
        <h2 className="c-cta-title" aria-label="Let's build something together.">
          <span className="c-line"><span className="c-line-in">Let’s build</span></span>
          <span className="c-line"><span className="c-line-in">something <em className="acc">together.</em></span></span>
        </h2>
        <a className="c-mail" href={`mailto:${EMAIL}`} data-cursor="hover" data-reveal>{EMAIL}</a>

        <div className="c-contact-grid">
          <div data-reveal>
            <span className="mono">Elsewhere</span>
            <ul className="c-links">
              <li><a href={`mailto:${EMAIL}`}>Email <small>Reply in 24h</small></a></li>
              <li><a href="tel:+919884326984">+91 98843 26984 <small>Call</small></a></li>
              <li><a href="https://www.linkedin.com/in/bharathkumarss" target="_blank" rel="noopener noreferrer">LinkedIn <small>↗</small></a></li>
              <li><a href="https://www.google.com/maps/search/?api=1&query=Perambur,+Chennai,+India" target="_blank" rel="noopener noreferrer">Perambur, Chennai <small>Map ↗</small></a></li>
            </ul>
          </div>
          <form className="c-form" onSubmit={submit} data-reveal>
            <div className="c-field"><label htmlFor="cn">Name</label><input id="cn" required value={form.name} onChange={set("name")} placeholder="Your name" /></div>
            <div className="c-field"><label htmlFor="ce">Email</label><input id="ce" type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" /></div>
            <div className="c-field"><label htmlFor="cm">Message</label><textarea id="cm" required rows={4} value={form.message} onChange={set("message")} placeholder="Tell me about your project…" /></div>
            <div><Magnetic><button className="c-btn solid" type="submit" disabled={sent}>{sent ? "Sent — thank you ✓" : <>Send message <Arrow /></>}</button></Magnetic></div>
          </form>
        </div>

        <footer className="c-footer mono">
          <span>© {new Date().getFullYear()} Bharath Kumar S</span>
          <span>Designed &amp; built by me</span>
          <button className="c-top mono" onClick={() => scrollToTarget(0)}>Back to top ↑</button>
        </footer>
      </div>
    </section>
  );
}
