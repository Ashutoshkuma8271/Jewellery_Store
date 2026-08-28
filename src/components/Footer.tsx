import React from 'react';
import { Share2, Globe, MessageCircle, CreditCard, ShieldCheck, Lock, Sparkles, Gem, Crown, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenAdminAuth?: () => void;
  onNavigateView?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdminAuth,
  onNavigateView
}) => {
  return (
    <footer className="w-full bg-[#121214] text-white border-t border-[#c8a96b]/30 pt-16 pb-8 transition-colors">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
        
        {/* Column 1: Brand Atelier */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-xl shadow-md">
              <Gem className="w-5 h-5 text-[#c8a96b]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.14em] text-white leading-none">
                A_S <span className="text-[#e7d5a5] font-light">JEWELLERY</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.25em] text-[#a09a90] uppercase font-bold mt-1">
                FINE JEWELRY & DIAMONDS
              </span>
            </div>
          </div>

          <p className="text-xs text-[#a09a90] leading-relaxed max-w-sm">
            Handcrafted fine jewelry, certified solitaires, and bespoke heirloom pieces crafted with BIS hallmarked gold and responsibly sourced diamonds.
          </p>

          <div className="flex items-center gap-3 pt-2 text-[#e7d5a5]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-[#c8a96b] hover:text-black rounded-full transition-all border border-white/10" aria-label="Instagram">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="https://wa.me/919334990000" target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-[#c8a96b] hover:text-black rounded-full transition-all border border-white/10" aria-label="WhatsApp Concierge">
              <MessageCircle className="w-4 h-4" />
            </a>
            <button onClick={() => onNavigateView && onNavigateView('about')} className="p-2.5 bg-white/5 hover:bg-[#c8a96b] hover:text-black rounded-full transition-all border border-white/10" aria-label="Global Heritage">
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column 2: Jewelry Collections */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#e7d5a5] uppercase">
            Collections
          </h4>
          <nav className="flex flex-col gap-2.5 text-xs text-white/70">
            <button onClick={() => onSelectCategory('Rings')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Diamond Rings & Solitaires
            </button>
            <button onClick={() => onSelectCategory('Necklaces')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Gold Necklaces & Pendants
            </button>
            <button onClick={() => onSelectCategory('Earrings')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Earrings & Studs
            </button>
            <button onClick={() => onSelectCategory('Bracelets')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Bangles & Tennis Bracelets
            </button>
            <button onClick={() => onSelectCategory('Bridal')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Bridal & Occasion Sets
            </button>
          </nav>
        </div>

        {/* Column 3: Customer Care */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#e7d5a5] uppercase">
            Client Concierge
          </h4>
          <nav className="flex flex-col gap-2.5 text-xs text-white/70">
            <button onClick={() => onNavigateView && onNavigateView('orders')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Track Order Status
            </button>
            <button onClick={() => onNavigateView && onNavigateView('contact')} className="text-left hover:text-[#e7d5a5] transition-colors">
              Book Private Consultation
            </button>
            <button onClick={() => onNavigateView && onNavigateView('about')} className="text-left hover:text-[#e7d5a5] transition-colors">
              BIS Hallmarking Certification
            </button>
            <button onClick={() => onNavigateView && onNavigateView('contact')} className="text-left hover:text-[#e7d5a5] transition-colors">
              15-Day Return & Exchange
            </button>
          </nav>
        </div>

        {/* Column 4: Dedicated Admin & Store Management Section */}
        <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-[#c8a96b]/30">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#e7d5a5]" />
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#e7d5a5] uppercase">
              Admin Portal
            </h4>
          </div>

          <p className="text-[11px] text-white/60 leading-relaxed">
            Restricted store administrator access. Manage jewelry catalog, add new products, update prices, manage stock, and review customer orders.
          </p>

          <button
            onClick={() => onOpenAdminAuth && onOpenAdminAuth()}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#c8a96b] to-[#e7d5a5] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Admin Login & Manage</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Bar with Razorpay & Payment Logos */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
        <p>© {new Date().getFullYear()} A_S JEWELLERY ATELIER. All rights reserved.</p>

        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-[10px] text-[#e7d5a5] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#c8a96b]" />
            Razorpay Secure Payment Gateway
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">UPI / GPAY</span>
            <span className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">PHONEPE</span>
            <span className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">CARDS</span>
            <span className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
