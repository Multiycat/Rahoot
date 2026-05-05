import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-surface-container-high rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 mb-8 rounded-full bg-surface-container-high text-primary font-headline text-[10px] uppercase tracking-[0.2em] outline outline-1 outline-outline-variant/15"
        >
          The Future of Interaction
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-on-surface mb-8"
        >
          Redefining <span className="text-primary-container">Engagement</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed"
        >
          A digital atelier for educators and presenters. Craft immersive learning experiences with editorial precision and nocturnal elegance.
        </motion.p>
      </div>

      {/* PIN Entry Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-surface-container-high rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-panel rounded-xl p-8 outline outline-1 outline-outline-variant/15">
          <h3 className="font-headline text-center mb-6 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Ready to play?
          </h3>
          <div className="flex flex-col space-y-4">
            <input 
              className="bg-transparent border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary text-center text-3xl font-bold tracking-[0.5em] text-primary-container placeholder:text-surface-variant py-4 uppercase" 
              placeholder="GAME PIN" 
              type="text" 
            />
            <motion.button 
              whileHover={{ scale: 1.02, brightness: 1.1 }}
              whileTap={{ scale: 0.98 }}
              className="cta-gradient text-on-primary-container w-full py-4 rounded-lg font-headline font-bold uppercase tracking-widest text-sm transition-all"
            >
              Enter Universe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
