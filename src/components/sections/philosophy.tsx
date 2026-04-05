import { motion } from "framer-motion";

const principles = [
  {
    title: "Build With Purpose",
    desc: "Every line of code, every design decision should serve a clear goal. I don't build for the sake of building — I build to solve real problems.",
    icon: "→",
  },
  {
    title: "Learn by Doing",
    desc: "Theory is the foundation, but mastery comes from getting your hands dirty. I learn best by shipping real projects and iterating fast.",
    icon: "↻",
  },
  {
    title: "Simplicity Over Complexity",
    desc: "The best solutions are often the simplest. I strive for elegant, maintainable work that anyone can understand and extend.",
    icon: "◇",
  },
  {
    title: "Embrace the Intersection",
    desc: "The most interesting work happens where disciplines collide — hardware meets software, design meets engineering, creativity meets logic.",
    icon: "✦",
  },
];

const beliefs = [
  "Ship early, iterate often",
  "Good design is invisible",
  "Constraints breed creativity",
  "Stay curious, stay humble",
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

export function Philosophy() {
  return (
    <section id="philosophy" className="py-24 md:py-36 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div {...fadeUp()} className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">04 — Philosophy</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif font-medium tracking-tight leading-tight max-w-3xl">
            How I think about building things.
          </h2>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">

          {/* Left — principles */}
          <div className="lg:col-span-7">
            <motion.div {...fadeUp(0.1)} className="mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground pb-4 border-b border-border">
                Core Principles
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  {...fadeUp(0.15 + i * 0.08)}
                  className="p-6 border border-border hover:border-foreground transition-colors duration-300 group"
                >
                  <span className="block text-2xl mb-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    {p.icon}
                  </span>
                  <h4 className="font-medium mb-2 group-hover:text-muted-foreground transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — beliefs */}
          <div className="lg:col-span-4 lg:col-start-9">
            <motion.div {...fadeUp(0.2)}>
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border">
                Things I Believe
              </h3>
              <div className="space-y-0">
                {beliefs.map((b, i) => (
                  <motion.div
                    key={b}
                    {...fadeUp(0.25 + i * 0.07)}
                    className="flex items-center gap-4 py-5 border-b border-border group"
                  >
                    <span className="font-mono text-xs text-muted-foreground shrink-0">0{i + 1}</span>
                    <span className="text-sm font-medium group-hover:text-muted-foreground transition-colors">
                      {b}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              {...fadeUp(0.4)}
              className="mt-12 pl-6 border-l-2 border-border"
            >
              <p className="text-base italic text-muted-foreground leading-relaxed">
                "The best way to predict the future is to build it."
              </p>
              <cite className="block mt-3 text-xs font-mono text-muted-foreground not-italic uppercase tracking-widest">
                — Alan Kay
              </cite>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
