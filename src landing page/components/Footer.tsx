import { Languages, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-outline-variant/10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-12 md:space-y-0">
          <div className="space-y-6">
            <div className="text-3xl font-black text-primary-container font-headline">Rahoot</div>
            <p className="text-stone-500 max-w-xs font-headline text-sm leading-relaxed">
              The high-end digital atelier for professional engagement and editorial-grade learning.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-xs font-headline uppercase tracking-[0.2em] text-on-surface-variant opacity-50">Resources</h4>
              <ul className="space-y-2">
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Documentation</a></li>
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Help Center</a></li>
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Community</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-headline uppercase tracking-[0.2em] text-on-surface-variant opacity-50">Legal</h4>
              <ul className="space-y-2">
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Privacy Policy</a></li>
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Terms of Service</a></li>
                <li><a className="text-stone-500 hover:text-stone-200 transition-colors text-sm" href="#">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-12 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-stone-500 text-xs opacity-80 hover:opacity-100">
            © 2024 Rahoot Inc. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Languages className="text-stone-500 hover:text-primary-container cursor-pointer transition-colors w-5 h-5" />
            <Globe className="text-stone-500 hover:text-primary-container cursor-pointer transition-colors w-5 h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
