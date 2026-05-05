import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-stone-950/60 backdrop-blur-xl border-b border-outline-variant/10"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <div className="text-2xl font-black tracking-tighter text-primary-container font-headline">
          Rahoot
        </div>
        <div className="hidden md:flex items-center space-x-12">
          <a className="text-primary-container font-bold border-b-2 border-primary-container pb-1 font-headline text-sm uppercase tracking-widest" href="#">
            Product
          </a>
          <a className="text-stone-400 font-medium font-headline text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300" href="#">
            Features
          </a>
          <a className="text-stone-400 font-medium font-headline text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300" href="#">
            Pricing
          </a>
          <a className="text-stone-400 font-medium font-headline text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300" href="#">
            Contact
          </a>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-headline uppercase tracking-wider text-xs font-bold transition-colors hover:brightness-110"
        >
          Join Game
        </motion.button>
      </div>
    </motion.nav>
  );
}
