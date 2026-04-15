import { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { Mail, MapPin, Send } from "lucide-react";

export function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`);
    window.location.href = `mailto:sbharathkumar1125@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="border-t border-border" aria-label="Contact">

      {/* Top CTA banner — inverted colors */}
      <div className="bg-foreground text-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div>
              <span className="font-sans text-xs text-background/50 uppercase tracking-[0.2em] block mb-4">04 — Contact</span>
              <h2 className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-display font-semibold leading-tight tracking-tight text-background">
                Let's build something<br />
                <span className="italic font-light text-background/50">together.</span>
              </h2>
            </div>
            <p className="text-base text-background/60 max-w-sm leading-relaxed">
              Whether it's a project, collaboration, or just a conversation — I respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact details + form */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Left — 3D Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex items-center justify-center lg:justify-start"
            >
              <div className="profile-parent group" role="presentation">
                <div className="profile-card">
                  <div className="profile-logo" aria-hidden="true">
                    <span className="circle circle1"></span>
                    <span className="circle circle2"></span>
                    <span className="circle circle3"></span>
                    <span className="circle circle4"></span>
                    <span className="circle circle5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                  </div>
                  <div className="profile-glass"></div>
                  <div className="profile-content">
                    <span className="title">Bharath Kumar S</span>
                    <span className="text block mt-8 mb-4">
                      Chennai, India<br/>
                      Response within 24 hours.
                    </span>
                  </div>
                  <div className="profile-bottom">
                    <div className="social-buttons-container">
                      <a
                        href="mailto:sbharathkumar1125@gmail.com"
                        className="social-button"
                        aria-label="Send email"
                      >
                        <Mail size={16} />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/bharathkumarss"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-button"
                        aria-label="Visit LinkedIn profile"
                      >
                        <FaLinkedin size={16} />
                      </a>
                      <div
                        className="social-button cursor-default"
                        title="Location: Chennai, India"
                        aria-label="Location: Chennai, India"
                        role="img"
                      >
                        <MapPin size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7 lg:col-start-6 space-y-6"
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
                    className="w-full px-4 py-3 bg-transparent border border-border rounded-xl hover:border-muted-foreground focus:border-accent outline-none text-sm transition-colors duration-200 font-sans"
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
                    className="w-full px-4 py-3 bg-transparent border border-border rounded-xl hover:border-muted-foreground focus:border-accent outline-none text-sm transition-colors duration-200 font-sans"
                    placeholder="your@email.com"
                    autoComplete="email"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground font-medium" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-transparent border border-border rounded-xl hover:border-muted-foreground focus:border-accent outline-none text-sm transition-colors duration-200 font-sans resize-none"
                  placeholder="Tell me about your project or idea..."
                  data-testid="input-message"
                />
              </div>

              <button
                type="submit"
                className="btn-accent group w-full flex items-center justify-center gap-3"
                data-testid="btn-send-message"
                aria-label={sent ? "Message sent" : "Send message"}
              >
                {sent ? (
                  <span>Message sent! Check your email client.</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send
                      size={14}
                      className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border" role="contentinfo">
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
