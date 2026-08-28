import React, { useState } from 'react';
import { ShoppingBag, Menu, Search, UserRound, X, Gem } from 'lucide-react';

interface Props { cartCount: number; onCart: () => void; onAccount: () => void; onNavigate: (view: string) => void; onSearch: (value: string) => void; searchQuery: string; }

export const GwellaryHeader: React.FC<Props> = ({ cartCount, onCart, onAccount, onNavigate, onSearch, searchQuery }) => {
  const [open, setOpen] = useState(false);
  const navigate = (view: string) => {
    setOpen(false);
    if (view.includes('#')) {
      const [v, hash] = view.split('#');
      onNavigate(v);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      onNavigate(view);
    }
  };

  return (
    <>
      <div className="bg-[#171717] px-4 py-2 text-center text-[10px] font-medium tracking-[.12em] text-white sm:text-xs">
        FREE SHIPPING ON ORDERS ABOVE ₹999 <span className="mx-3 hidden text-[#e7d5a5] sm:inline">•</span>
        <span className="hidden sm:inline">EASY RETURNS • SECURE PAYMENTS • CERTIFIED JEWELRY</span>
      </div>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf8f4]/95 dark:bg-[#17171a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <button className="lg:hidden p-2 rounded-xl text-black dark:text-white" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 text-left group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-base shadow-sm">
              <Gem className="w-4 h-4 text-[#c8a96b]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[.14em] font-bold uppercase leading-none text-black dark:text-white">
                A_S <span className="text-[#a78345] dark:text-[#c8a96b]">JEWELLERY</span>
              </span>
              <span className="text-[7px] font-sans tracking-[0.2em] text-[#8c8275] uppercase font-bold mt-0.5">
                FINE JEWELRY & DIAMONDS
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-[11px] font-semibold tracking-[.13em] lg:flex text-[#171717] dark:text-white">
            {[
              ['HOME', 'home'],
              ['SHOP', 'shop'],
              ['COLLECTIONS', 'home#categories'],
              ['NEW ARRIVALS', 'home#new-arrivals'],
              ['BEST SELLERS', 'home#best-sellers'],
              ['ABOUT US', 'about'],
              ['CONTACT US', 'contact']
            ].map(([label, view]) => (
              <button
                key={label}
                onClick={() => navigate(view)}
                className="border-b-2 border-transparent py-7 transition hover:border-[#c8a96b] hover:text-[#a78345] dark:hover:text-[#c8a96b]"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 text-black dark:text-white">
            <form onSubmit={(event) => { event.preventDefault(); navigate('shop'); }} className="hidden items-center border-b border-[#171717]/30 dark:border-white/30 sm:flex">
              <Search className="h-4 w-4 text-[#a78345] dark:text-[#c8a96b]" />
              <input
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search jewels..."
                className="w-24 bg-transparent px-2 py-1.5 text-xs outline-none md:w-36 text-black dark:text-white"
              />
            </form>
            <button onClick={onAccount} aria-label="Account" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <UserRound className="h-5 w-5" />
            </button>
            <button onClick={onCart} className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Shopping bag">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4.5 w-4.5 place-items-center rounded-full bg-[#c8a96b] text-[9px] font-bold text-black shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-black/10 dark:border-white/10 bg-[#faf8f4] dark:bg-[#17171a] p-5 lg:hidden animate-in slide-in-from-top duration-200">
            {[
              ['Shop All', 'shop'],
              ['Collections', 'home#categories'],
              ['New Arrivals', 'home#new-arrivals'],
              ['Best Sellers', 'home#best-sellers'],
              ['About Us', 'about'],
              ['Contact Us', 'contact']
            ].map(([label, view]) => (
              <button
                key={label}
                onClick={() => navigate(view)}
                className="block w-full border-b border-black/5 dark:border-white/5 py-4 text-left text-xs font-semibold tracking-[.13em] uppercase text-black dark:text-white hover:text-[#a78345] dark:hover:text-[#c8a96b]"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
