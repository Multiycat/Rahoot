import { motion } from "motion/react";
import { Bolt, ArrowRight } from "lucide-react";

export default function BentoFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Feature Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 bg-surface-container-low p-12 rounded-xl flex flex-col justify-end min-h-[400px] relative overflow-hidden group border border-outline-variant/10"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" 
            src="https://picsum.photos/seed/sculpture/1200/800" 
            alt="Editorial Visuals"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10">
            <span className="text-primary font-headline text-xs uppercase tracking-widest mb-4 block">Visual Fidelity</span>
            <h2 className="text-4xl font-bold mb-4">Editorial Quality Visuals</h2>
            <p className="text-on-surface-variant max-w-md">
              Break free from cartoons. Rahoot brings high-end aesthetics to interactive slides, making every session feel like a professional keynote.
            </p>
          </div>
        </motion.div>

        {/* Latency Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 bg-surface-container-high p-8 rounded-xl border border-outline-variant/15 flex flex-col items-center text-center justify-center space-y-6"
        >
          <div className="w-16 h-16 bg-surface-container-low flex items-center justify-center rounded-full">
            <Bolt className="text-primary w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">Latency Zero</h3>
          <p className="text-on-surface-variant text-sm">
            Real-time interaction with sub-millisecond sync across 10,000+ simultaneous participants.
          </p>
        </motion.div>

        {/* Asymmetric Design Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">Asymmetric Design</h3>
            <p className="text-on-surface-variant text-sm">
              Our layout engine automatically balances your content into beautiful, magazine-style layouts.
            </p>
          </div>
          <div className="pt-6 border-t border-outline-variant/10 mt-6 flex justify-between items-center group cursor-pointer">
            <span className="text-xs font-headline uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Learn More</span>
            <ArrowRight className="text-primary w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Dynamic Scoring Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-8 bg-surface p-12 rounded-xl border border-outline-variant/15 flex items-center justify-between relative overflow-hidden"
        >
          <div className="max-w-md relative z-10">
            <h3 className="text-3xl font-bold mb-4 text-primary">Dynamic Scoring</h3>
            <p className="text-on-surface-variant">
              Weighted algorithms that reward accuracy, speed, and creative thinking, not just clicking first.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
        </motion.div>
      </div>
    </section>
  );
}
