import { motion } from "motion/react";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Essential",
    price: "$0",
    features: ["Up to 50 players", "Basic Editor", "Standard Reports"],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Professional",
    price: "$19",
    features: ["Up to 1,000 players", "Editorial Builder", "Video Backgrounds", "Custom Branding"],
    cta: "Go Pro Now",
    popular: true
  },
  {
    name: "Institutional",
    price: "$Custom",
    features: ["Unlimited Players", "SSO & Security", "Multi-user Admin", "LMS Integrations"],
    cta: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-4">Transparent Tiers.</h2>
          <p className="text-on-surface-variant">Scale your influence with precision.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-10 rounded-xl flex flex-col relative border ${
                tier.popular ? "bg-surface-container-high border-primary" : "bg-surface-container-low border-outline-variant/15"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-on-primary-container px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded">
                  Most Popular
                </div>
              )}
              <h3 className={`text-sm font-headline uppercase tracking-widest mb-4 ${tier.popular ? "text-primary" : "text-on-surface-variant"}`}>
                {tier.name}
              </h3>
              <div className="text-4xl font-black mb-8">
                {tier.price}
                {tier.price !== "$Custom" && <span className="text-sm font-normal text-on-surface-variant">/mo</span>}
              </div>
              <ul className="space-y-4 mb-12 flex-grow text-sm text-on-surface-variant">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${tier.popular ? "text-primary" : "text-on-surface-variant"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-4 rounded-lg text-sm font-black uppercase tracking-wider transition-all ${
                  tier.popular ? "cta-gradient text-on-primary-container shadow-xl" : "outline outline-1 outline-outline-variant hover:bg-surface-container-high"
                }`}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
