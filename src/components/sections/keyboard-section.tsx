import { motion } from "framer-motion";
import { Keyboard } from "@/components/ui/keyboard";
import { ChatInterface } from "@/components/shared/ChatInterface";

export function KeyboardSection() {

  return (
    <section id="keyboard" className="c-section" aria-label="Interactive Keyboard">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="c-tactile-head" data-reveal>
          <span className="mono c-eyebrow">AI — Interaction</span>
          <h2 className="c-h2" data-split>The <em className="acc">tactile</em> interface</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Chat Column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="c-fit-chat h-[560px] w-full lg:w-[440px] shrink-0 relative z-20 order-2 lg:order-1 flex flex-col justify-center"
          >
            <ChatInterface isInline />
          </motion.div>

          {/* Keyboard Column */}
          <motion.div 
            layout
            className="c-fit-kb relative flex flex-col justify-center order-1 lg:order-2 h-[460px] w-full lg:w-auto"
          >
             {/* Background glow for the keyboard */}
            <div className="absolute inset-0 bg-primary/10 blur-[140px] rounded-full scale-90 opacity-40 -top-20" />
            
            <div className="relative z-10 w-full flex items-center justify-center">
              <Keyboard 
                enableSound 
                onKeyPress={(key, isVirtual) => {
                  window.dispatchEvent(new CustomEvent("keyboard-press", { detail: { key, isVirtual } }));
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
