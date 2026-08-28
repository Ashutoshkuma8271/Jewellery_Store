import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Package,
  MapPin,
  User,
  LogOut,
  LogIn,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  Gem
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: string;
  onNavigateView: (view: string) => void;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatar: string;
    memberTier: string;
    phone: string;
    role?: string;
  } | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onSelectProduct,
  products = [],
  activeCategory,
  onSelectCategory,
  darkMode,
  onToggleDarkMode,
  currentView,
  onNavigateView,
  isAuthenticated = false,
  user,
  onOpenAuthModal,
  onLogout,
  searchQuery: externalSearchQuery,
  onSearchChange
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleSearchChange = (value: string) => {
    setInternalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Scroll detection for dynamic shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchFocused(true);
        const searchInput = document.getElementById('navbar-live-search');
        if (searchInput) (searchInput as HTMLInputElement).focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSearchProducts = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim())))
      )
    : [];

  const handleNavClick = (view: string, categoryName?: string) => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsSearchMobileOpen(false);
    setIsSearchFocused(false);

    if (categoryName) {
      onSelectCategory(categoryName);
      onNavigateView('shop');
      return;
    }

    if (view === 'categories' || view === 'new-arrivals' || view === 'best-sellers') {
      if (currentView !== 'home') {
        onNavigateView('home');
        setTimeout(() => {
          document.getElementById(view)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById(view)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    onNavigateView(view);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl shadow-lg border-b border-[#c8a96b]/20 dark:border-[#c8a96b]/15'
        : 'bg-[#faf8f4]/95 dark:bg-[#17171a]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5'
    }`}>
      
      {/* Top Announcement Bar */}
      <div className="bg-[#171717] dark:bg-[#0d0d0f] text-white text-[10px] sm:text-[11px] font-medium py-1.5 px-3 sm:px-6 text-center tracking-wide flex items-center justify-between border-b border-[#c8a96b]/20">
        <div className="hidden md:flex items-center gap-2 text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-[#c8a96b] animate-pulse" />
          <span className="font-serif tracking-widest text-[#e7d5a5]">A_S JEWELLERY ATELIER</span>
          <span className="text-gray-500">•</span>
          <span className="text-xs text-gray-300">Handcrafted Gold & Diamond Heirloom Pieces</span>
        </div>

        <div className="mx-auto md:mx-0 font-sans tracking-wider uppercase text-[9px] sm:text-[10px] text-[#e7d5a5] font-bold flex items-center gap-1.5">
          <Crown className="w-3 h-3 text-[#c8a96b] inline" />
          <span>Complimentary Insured Express Delivery Across India on Orders Above ₹999</span>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-gray-300">
          <div className="flex items-center gap-1.5 text-xs text-[#e7d5a5] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c8a96b]" />
            <span>BIS Hallmarked & 100% Certified</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="font-mono text-[10px] bg-white/10 text-[#e7d5a5] px-2 py-0.5 rounded font-bold border border-[#c8a96b]/30">INR (₹)</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-18 md:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand Logo & Emblem */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.02]"
            aria-label="Go to Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] dark:from-[#2a2620] dark:to-[#171717] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-xl shadow-md group-hover:border-[#c8a96b] transition-all">
              <Gem className="w-5 h-5 text-[#c8a96b] transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#171717] dark:text-white uppercase leading-none">
                A_S <span className="text-[#a78345] dark:text-[#c8a96b] font-light">JEWELLERY</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.25em] text-[#8c8275] dark:text-[#b0a79a] uppercase font-bold mt-1">
                FINE JEWELRY & DIAMONDS
              </span>
            </div>
          </button>

          {/* Desktop & Laptop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Collection' },
              { id: 'categories', label: 'Categories' },
              { id: 'new-arrivals', label: 'New In' },
              { id: 'best-sellers', label: 'Best Sellers' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Concierge' }
            ].map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[10px] xl:text-[11px] font-bold tracking-[0.08em] xl:tracking-[0.12em] uppercase transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'text-white bg-[#171717] dark:bg-[#c8a96b] dark:text-black shadow-sm'
                      : 'text-[#4a4742] dark:text-[#d1ccc4] hover:text-[#a78345] dark:hover:text-[#c8a96b] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: Smart Live Search Bar */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-[160px] lg:max-w-[210px] xl:max-w-md relative">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78345] dark:text-[#c8a96b] transition-colors pointer-events-none" />
            <input
              id="navbar-live-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search diamond rings, gold necklaces, earrings..."
              className="w-full bg-white dark:bg-[#1f1e22] text-[#171717] dark:text-white rounded-full py-2.5 pl-11 pr-22 text-xs font-medium outline-none border border-[#c8a96b]/30 dark:border-[#c8a96b]/20 focus:border-[#a78345] dark:focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20 shadow-xs transition-all placeholder:text-[#8e8a83]"
            />
            
            {/* Quick Clear or Keyboard Shortcut */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => handleSearchChange('')}
                  className="px-2 py-0.5 rounded-full bg-[#f3ece6] dark:bg-zinc-800 text-[10px] font-bold text-[#6d675e] dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Clear
                </button>
              ) : (
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-mono font-bold text-[#8c8275] bg-[#faf8f4] dark:bg-zinc-800 border border-[#c8a96b]/30 rounded shadow-2xs">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Interactive Live Search Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 dark:bg-[#1a191d]/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[#c8a96b]/30 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[420px] overflow-y-auto">
              {filteredSearchProducts.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1.5 border-b border-black/5 dark:border-white/5 pb-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#a78345] dark:text-[#c8a96b] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Live Results ({filteredSearchProducts.length})
                    </span>
                    <button
                      onClick={() => {
                        if (currentView !== 'shop') onNavigateView('shop');
                        setIsSearchFocused(false);
                      }}
                      className="text-[10px] font-bold text-[#77736d] hover:text-[#171717] dark:hover:text-white underline"
                    >
                      View All Collection →
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {filteredSearchProducts.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onNavigateView('product');
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-[#faf8f4] dark:hover:bg-zinc-800/80 rounded-xl transition-all text-left group border border-transparent hover:border-[#c8a96b]/20"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={handleImageError}
                          className="w-12 h-12 object-cover rounded-lg shrink-0 shadow-xs bg-[#f3ece6]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif font-bold text-[#171717] dark:text-white truncate group-hover:text-[#a78345] dark:group-hover:text-[#c8a96b] transition-colors">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#a78345] dark:text-[#c8a96b] bg-[#c8a96b]/10 px-1.5 py-0.5 rounded">
                              {p.subCategory || p.category}
                            </span>
                            {p.badge && (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-[#171717] dark:text-white">
                            {formatCurrency(p.price)}
                          </p>
                          <span className="text-[10px] text-[#a78345] font-semibold flex items-center justify-end gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            View <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchQuery ? (
                <div className="p-6 text-center text-xs text-[#77736d] dark:text-gray-400">
                  <Gem className="w-8 h-8 mx-auto text-[#c8a96b]/40 mb-2" />
                  No luxury jewelry items found matching "<span className="font-bold text-[#171717] dark:text-white">{searchQuery}</span>"
                  <p className="mt-1 text-[11px] text-[#a78345]">Try searching for Rings, Necklaces, Diamonds, or Earrings</p>
                </div>
              ) : (
                <div className="p-3 space-y-2.5">
                  <div className="text-[10px] font-bold tracking-widest text-[#a78345] dark:text-[#c8a96b] uppercase flex items-center gap-1.5">
                    <Crown className="w-3 h-3" />
                    Popular Jewelry Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Rings', 'Diamond Necklaces', 'Earrings', 'Gold Bangles', 'Bridal Collection', 'Solitaire', 'Gemstones'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSearchChange(tag)}
                        className="px-3 py-1 bg-[#f5efe9] dark:bg-zinc-800 hover:bg-[#171717] hover:text-white dark:hover:bg-[#c8a96b] dark:hover:text-black rounded-full text-[11px] font-medium text-[#4a4742] dark:text-gray-300 transition-all border border-[#c8a96b]/20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions & User Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile Search Trigger */}
          <button
            onClick={() => setIsSearchMobileOpen(!isSearchMobileOpen)}
            className="md:hidden p-2.5 hover:bg-[#f3ece6] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#171717] dark:text-white"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 text-[#a78345]" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 sm:p-2.5 rounded-full text-[#171717] dark:text-white hover:bg-[#f3ece6] dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-[#c8a96b]/30"
            aria-label="Toggle theme mode"
            title={darkMode ? 'Switch to Warm Pearl Mode' : 'Switch to Midnight Obsidian Mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#e5c07b] transition-transform duration-500 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a4742] transition-transform duration-500 hover:-rotate-12" />
            )}
          </button>

          {/* Wishlist Button with Animated Ping Badge */}
          <button
            onClick={onOpenWishlist}
            className="p-2 sm:p-2.5 hover:bg-[#f3ece6] dark:hover:bg-zinc-800 rounded-full transition-all relative text-[#171717] dark:text-white border border-transparent hover:border-[#c8a96b]/30"
            aria-label="View Wishlist"
            title="Your Saved Pieces"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlistCount > 0 ? 'fill-[#c8a96b] text-[#c8a96b]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#c8a96b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-2 ring-[#faf8f4] dark:ring-[#17171a]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Luxury Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="p-2 sm:py-2 sm:px-4 bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md hover:shadow-lg border border-[#c8a96b]/30"
            aria-label="Open Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#e7d5a5] dark:text-black" />
            <span className="text-xs font-bold tracking-wider hidden sm:inline uppercase">
              Bag
            </span>
            {cartCount > 0 && (
              <span className="bg-[#c8a96b] dark:bg-black text-white dark:text-[#c8a96b] text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Control */}
          <div className="relative" ref={profileMenuRef}>
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 p-1 hover:bg-[#f3ece6] dark:hover:bg-zinc-800 rounded-full transition-all border border-[#c8a96b]/30"
                aria-label="User Account Menu"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#c8a96b]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#a78345] hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal()}
                className="flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-full bg-white dark:bg-zinc-800 hover:bg-[#171717] hover:text-white dark:hover:bg-[#c8a96b] dark:hover:text-black text-xs font-bold tracking-wider uppercase transition-all text-[#171717] dark:text-white border border-[#c8a96b]/40 shadow-xs"
                title="Sign In / Register"
              >
                <User className="w-3.5 h-3.5 text-[#a78345]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && isAuthenticated && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1c1b1f] rounded-2xl shadow-2xl border border-[#c8a96b]/30 p-2 z-50 text-xs font-semibold space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-3 border-b border-black/5 dark:border-white/5 bg-[#faf8f4] dark:bg-zinc-800/50 rounded-xl mb-1">
                  <p className="text-[#171717] dark:text-white font-serif font-bold text-sm truncate">{user.name}</p>
                  <p className="text-[11px] text-[#77736d] dark:text-gray-400 font-mono truncate">{user.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#c8a96b]/20 text-[#a78345] dark:text-[#e7d5a5] px-2 py-0.5 rounded-md border border-[#c8a96b]/30">
                    <Crown className="w-2.5 h-2.5" />
                    {user.role === 'admin' ? 'Store Administrator' : (user.memberTier || 'A_S JEWELLERY Elite Member')}
                  </span>
                </div>

                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#faf8f4] dark:hover:bg-zinc-800 text-[#171717] dark:text-white flex items-center gap-2.5 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#a78345]" />
                  <span>My Profile & Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavClick('orders')}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#faf8f4] dark:hover:bg-zinc-800 text-[#171717] dark:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Package className="w-4 h-4 text-[#a78345]" />
                  <span>Track My Orders</span>
                </button>

                <button
                  onClick={() => handleNavClick('addresses')}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#faf8f4] dark:hover:bg-zinc-800 text-[#171717] dark:text-white flex items-center gap-2.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#a78345]" />
                  <span>Saved Addresses</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#a78345] dark:text-amber-300 flex items-center gap-2.5 transition-colors font-bold border border-[#c8a96b]/20"
                  >
                    <Crown className="w-4 h-4 text-[#c8a96b]" />
                    <span>Admin Control Center</span>
                  </button>
                )}

                <div className="border-t border-black/5 dark:border-white/5 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 sm:p-2.5 lg:hidden rounded-2xl transition-all duration-200 shrink-0 ml-1 flex items-center justify-center border ${
              isMobileMenuOpen
                ? 'bg-[#c8a96b] text-white border-[#c8a96b]'
                : 'bg-white dark:bg-zinc-800 text-[#171717] dark:text-white border-[#c8a96b]/30 hover:bg-[#f3ece6]'
            }`}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchMobileOpen && (
        <div className="md:hidden border-t border-[#c8a96b]/20 bg-[#faf8f4] dark:bg-[#1a191d] px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78345]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search rings, necklaces, earrings..."
              className="w-full bg-white dark:bg-zinc-800 text-[#171717] dark:text-white rounded-full py-2.5 pl-10 pr-20 text-xs font-medium outline-none border border-[#c8a96b]/40 focus:ring-2 focus:ring-[#c8a96b]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#77736d] px-2 py-0.5 rounded-full bg-[#f3ece6] dark:bg-zinc-700"
              >
                Clear
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-bold tracking-wider text-[#a78345] uppercase">
                Matching Jewelry ({filteredSearchProducts.length})
              </div>
              {filteredSearchProducts.length > 0 ? (
                filteredSearchProducts.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onNavigateView('product');
                      setIsSearchMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 bg-white dark:bg-zinc-800/80 rounded-xl text-left border border-black/5"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={handleImageError}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 bg-[#f3ece6]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif font-bold truncate text-[#171717] dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-[#a78345] uppercase font-semibold">{p.category}</p>
                    </div>
                    <span className="text-xs font-bold text-[#171717] dark:text-white shrink-0">{formatCurrency(p.price)}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-[#77736d] p-2">No matching jewelry pieces found</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile & Tablet Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c8a96b]/20 bg-white/98 dark:bg-[#17171a]/98 backdrop-blur-2xl px-6 py-6 space-y-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-[#a78345] dark:text-[#c8a96b] uppercase px-3 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              EXPLORE ATELIER
            </span>
            {[
              { id: 'home', label: '01. Atelier Home' },
              { id: 'shop', label: '02. Complete Collection' },
              { id: 'categories', label: '03. Categories & Edits' },
              { id: 'new-arrivals', label: '04. New In Arrivals' },
              { id: 'best-sellers', label: '05. Most Loved Pieces' },
              { id: 'about', label: '06. Our Craft & Heritage' },
              { id: 'contact', label: '07. VIP Concierge' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-serif font-bold transition-all ${
                  currentView === item.id
                    ? 'bg-[#171717] text-white dark:bg-[#c8a96b] dark:text-black shadow-sm'
                    : 'text-[#4a4742] dark:text-gray-200 hover:bg-[#faf8f4] dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-[#c8a96b]/20 pt-4 space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-[#a78345] dark:text-[#c8a96b] uppercase px-3 flex items-center gap-1.5">
              <Crown className="w-3 h-3" />
              PATRON ACCOUNT
            </span>

            {isAuthenticated ? (
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-[#171717] dark:text-white flex items-center gap-3 hover:bg-[#faf8f4] dark:hover:bg-zinc-800"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#a78345]" />
                  <span>My Profile & Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavClick('orders')}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-[#171717] dark:text-white flex items-center gap-3 hover:bg-[#faf8f4] dark:hover:bg-zinc-800"
                >
                  <Package className="w-4 h-4 text-[#a78345]" />
                  <span>My Order History</span>
                </button>
                <button
                  onClick={() => handleNavClick('addresses')}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-[#171717] dark:text-white flex items-center gap-3 hover:bg-[#faf8f4] dark:hover:bg-zinc-800"
                >
                  <MapPin className="w-4 h-4 text-[#a78345]" />
                  <span>Address Book</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="w-full py-3.5 bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN / CREATE PATRON ACCOUNT</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
