import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

export default function FeatureDeepDive() {
  return (
    <section className="py-32 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-6">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center gap-24 mb-48">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <span className="text-primary font-headline text-xs uppercase tracking-[0.3em]">Curation</span>
            <h2 className="text-5xl font-black leading-tight">The Art of the Question.</h2>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed">
              Rahoot's question builder isn't a form; it's a canvas. Incorporate high-resolution video, 3D models, and rich text snippets that elevate the learning experience.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="text-sm font-medium">Native LaTeX Support for Mathematics</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="text-sm font-medium">Embedded WebGL Components</span>
              </li>
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden relative border border-outline-variant/10"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/tech/800/800" 
              alt="Tech Circuitry"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <span className="text-primary font-headline text-xs uppercase tracking-[0.3em]">Intelligence</span>
            <h2 className="text-5xl font-black leading-tight">Insight, not just data.</h2>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed">
              Post-game reports generated through our proprietary analysis engine highlight specific knowledge gaps and suggest targeted interventions.
            </p>
            <div className="p-6 glass-panel rounded-lg border border-outline-variant/15">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-headline uppercase tracking-wider">Retention Index</span>
                <span className="text-primary text-xs font-bold">94%</span>
              </div>
              <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-primary h-full"
                />
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden relative border border-outline-variant/10"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/dashboard/800/800" 
              alt="Data Dashboard"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
