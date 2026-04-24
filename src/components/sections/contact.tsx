import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Optimistic UI: Show success immediately
    setSent(true);
    const currentData = { ...formState };
    setFormState({ name: "", email: "", message: "" });
    
    try {
      const { sendMessage } = await import("@/services/firestore");
      await sendMessage(currentData);
      
      // Auto-reset "Sent" state after 5 seconds
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Something went wrong. Please try again later.");
      setSent(false); // Revert if failed
    }
  }

  return (
    <section id="contact" className="" aria-label="Contact">

      {/* Top CTA banner — Translucent Glass Effect */}
      <div className="py-20 md:py-28 border-y border-border/60 backdrop-blur-2xl backdrop-saturate-150 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div>
              <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em] block mb-4">04 — Contact</span>
              <h2
                className="font-display font-semibold text-foreground"
                style={{
                  fontSize: "clamp(calc(2.25rem * var(--font-heading-scale, 1)), calc(5.5vw * var(--font-heading-scale, 1)), calc(4.5rem * var(--font-heading-scale, 1)))",
                  lineHeight: "var(--font-heading-line-height, 1.1)",
                  letterSpacing: "var(--font-heading-letter-spacing, -0.02em)",
                }}
              >
                Let's build something<br />
                <span className="italic font-light text-accent">together.</span>
              </h2>
            </div>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              Whether it's a project, collaboration, or just a conversation — I respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact details + form */}
      <div className="pt-24 md:pt-36 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <div className="h-full rounded-2xl border border-border/60 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-8 md:p-10 flex flex-col justify-center gap-8 bg-card/40" style={{ boxShadow: 'var(--base-shadow)' }}>
              <div>
                <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em] block mb-4">
                  Get in touch
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Bharath Kumar S
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  Electronics &amp; Instrumentation Engineer · Developer
                </p>
              </div>

              <ul className="space-y-4" aria-label="Contact details">
                <li>
                  <a
                    href="mailto:sbharathkumar1125@gmail.com"
                    className="group flex items-center gap-4 text-sm font-sans text-foreground hover:text-accent transition-colors"
                    data-testid="link-email"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-accent transition-colors">
                      <Mail size={16} aria-hidden="true" />
                    </span>
                    <span>sbharathkumar1125@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919884326984"
                    className="group flex items-center gap-4 text-sm font-sans text-foreground hover:text-accent transition-colors"
                    data-testid="link-phone"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-accent transition-colors">
                      <Phone size={16} aria-hidden="true" />
                    </span>
                    <span>+91 98843 26984</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/bharathkumarss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-sm font-sans text-foreground hover:text-accent transition-colors"
                    data-testid="link-linkedin"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-accent transition-colors">
                      <FaLinkedin size={16} aria-hidden="true" />
                    </span>
                    <span>linkedin.com/in/bharathkumarss</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Perambur,+Chennai,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-sm font-sans text-foreground hover:text-accent transition-colors"
                    data-testid="link-location"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-accent transition-colors">
                      <MapPin size={16} aria-hidden="true" />
                    </span>
                    <span>Perambur, Chennai, India</span>
                  </a>
                </li>
              </ul>
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7 h-full rounded-2xl border border-border/60 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-8 md:p-10 flex flex-col gap-6 bg-card/40"
              style={{ boxShadow: 'var(--base-shadow)' }}
              onSubmit={handleSubmit}
              aria-label="Contact form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground font-medium" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-colors placeholder:text-muted-foreground text-foreground text-sm font-sans"
                    placeholder="Your name"
                    autoComplete="name"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground font-medium" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-colors placeholder:text-muted-foreground text-foreground text-sm font-sans"
                    placeholder="your@email.com"
                    autoComplete="email"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col flex-1 min-h-0">
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground font-medium" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  className="w-full flex-1 min-h-[160px] px-4 py-3 bg-background border border-border rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-colors placeholder:text-muted-foreground text-foreground text-sm font-sans resize-none"
                  placeholder="Tell me about your project or idea..."
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full"
                data-testid="btn-send-message"
                aria-label={sent ? "Message sent" : "Send message"}
              >
                {sent ? "Message sent! I'll get back to you soon." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bharath Kumar S. All rights reserved.
          </span>
          <span className="font-sans text-xs text-muted-foreground">
            Design is communication.
          </span>
        </div>
      </footer>
    </section>
  );
}
