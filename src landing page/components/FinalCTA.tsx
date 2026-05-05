import { motion } from "motion/react";

export default function FinalCTA() {
  return (
    <section className="py-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-black mb-12 leading-tight"
        >
          Elevate your <br /><span className="text-primary">Masterclass.</span>
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-gradient text-on-primary-container px-12 py-5 rounded-full text-lg font-black uppercase tracking-widest transition-transform shadow-2xl"
          >
            Create Your Account
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-panel text-on-surface px-12 py-5 rounded-full text-lg font-black uppercase tracking-widest border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
          >
            Schedule Demo
          </motion.button>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 blur-[100px] pointer-events-none">
        <div className="w-[80%] h-[80%] bg-primary rounded-full mx-auto"></div>
      </div>
    </section>
  );
}
