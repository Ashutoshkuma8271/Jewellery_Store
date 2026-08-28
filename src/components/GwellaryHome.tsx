import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag, Check, ChevronRight, Heart, Instagram, Sparkles, Star, Truck, ShieldCheck } from 'lucide-react';
import { Category, Product, Review } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { getOptimizedImageUrl } from '../utils/cloudinary';

type Props = {
  categories: Category[];
  products: Product[];
  reviews: Review[];
  wishlistIds: string[];
  cartCount: number;
  onShop: (category?: string) => void;
  onProduct: (product: Product) => void;
  onAdd: (product: Product) => void;
  onWishlist: (id: string) => void;
  onCart: () => void;
  onAccount: () => void;
};

const heroSlides = [
  {
    eyebrow: 'NEW COLLECTION 2026',
    title: 'Elegance, Crafted',
    accent: 'for Every Moment',
    copy: 'Discover timeless jewelry handcrafted with certified diamonds and pure 18K/22K gold designed to celebrate your individuality.',
    cta: 'SHOP COLLECTION',
    image: 'https://static.wixstatic.com/media/84770f_0867b395d9f74f4c94562ac6e5ce348d~mv2.png/v1/fill/w_1901,h_1026,fp_0.41_0.40,q_90,usm_0.66_1.00_0.01,enc_auto/weavy-Gemini%203%20(Nano%20Banana%20Pro)-2026-01-15%20at%2015_38_35.png'
  },
  {
    eyebrow: 'THE DIAMOND EDIT',
    title: 'Timeless Pieces.',
    accent: 'Modern Radiance.',
    copy: 'Fine solitaire diamonds and softly sculpted gold made for everyday luxury and grand celebrations.',
    cta: 'EXPLORE DIAMONDS',
    image: 'photo-1605100804763-247f67b3557e'
  },
  {
    eyebrow: 'BRIDAL & OCCASION',
    title: 'Make Every',
    accent: 'Occasion Shine',
    copy: 'Heirloom bridal sets, necklaces, and polki treasures made for milestones and new beginnings.',
    cta: 'SHOP THE EDIT',
    image: 'photo-1599643478518-a784e5dc4c8f'
  },
  {
    eyebrow: 'A_S JEWELLERY SIGNATURE',
    title: 'Your Story,',
    accent: 'Your Jewelry',
    copy: 'Bespoke fine jewelry made with ethical gold, certified gemstones, and artisanal precision.',
    cta: 'DISCOVER ATELIER',
    image: 'photo-1635767798638-3e25273a8236'
  }
];

const photo = (id: string, width = 1000) =>
  id.startsWith('https://') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const GwellaryHome: React.FC<Props> = ({
  categories,
  products,
  reviews,
  wishlistIds,
  onShop,
  onProduct,
  onAdd,
  onWishlist
}) => {
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tab, setTab] = useState('All');
  const [bestSellerCategory, setBestSellerCategory] = useState('All');
  const current = heroSlides[slide];

  useEffect(() => {
    if (hovered) return;
    const timer = window.setInterval(() => setSlide((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [hovered]);

  // Handle direct hash navigation on page mount / hash change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    };
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  const selectCategory = (name?: string) => onShop(name === 'All' ? undefined : name);

  const productCard = (product: Product, index: number) => (
    <article key={product.id} className="gwellary-product-tilt group relative min-w-[260px] max-w-[280px] snap-start bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3ece6] dark:bg-zinc-800">
        <img
          loading="lazy"
          decoding="async"
          src={getOptimizedImageUrl(product.image, { width: 600, quality: 'auto' })}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <button
          onClick={() => onWishlist(product.id)}
          aria-label={`Save ${product.name}`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-[#171717] dark:text-white shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 ${wishlistIds.includes(product.id) ? 'fill-[#c8a96b] text-[#c8a96b]' : ''}`} />
        </button>
        {index < 4 && (
          <span className="absolute left-3 top-3 bg-[#171717] dark:bg-[#c8a96b] px-2.5 py-1 text-[9px] font-bold tracking-[.15em] text-white dark:text-black rounded-md">
            BESTSELLER
          </span>
        )}
        <button
          onClick={() => onAdd(product)}
          className="absolute inset-x-3 bottom-3 translate-y-14 bg-[#171717] dark:bg-[#c8a96b] py-3 text-[11px] font-bold tracking-[.13em] text-white dark:text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 rounded-xl shadow-lg"
        >
          ADD TO BAG
        </button>
      </div>

      <div className="p-4">
        <p className="text-[10px] tracking-[.15em] text-[#a78345] dark:text-[#c8a96b] uppercase font-bold">
          {product.subCategory || product.category}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <button
            onClick={() => onProduct(product)}
            className="text-left font-serif text-base leading-tight text-[#171717] dark:text-white hover:text-[#a78345] dark:hover:text-[#c8a96b] truncate"
          >
            {product.name}
          </button>
          <span className="shrink-0 text-sm font-bold text-[#171717] dark:text-white">
            {formatCurrency(product.price)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-[#77736d] dark:text-gray-400">
          <Star className="h-3 w-3 fill-[#c8a96b] text-[#c8a96b]" />
          <span className="font-semibold text-black dark:text-white">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
      </div>
    </article>
  );

  return (
    <div className="w-full text-[#171717] dark:text-white">
      {/* Hero Carousel Section */}
      <section
        id="g-hero"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative isolate overflow-hidden bg-[#f1e5e1] dark:bg-[#1a1715]"
      >
        <div key={slide} className="grid min-h-[640px] lg:grid-cols-[1fr_1fr]">
          <div className="z-10 flex items-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
            <div className="max-w-xl hero-slide-enter">
              <p className="mb-4 text-[11px] font-bold tracking-[.25em] text-[#a78345] dark:text-[#c8a96b] uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {current.eyebrow}
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.02]">
                {current.title}
                <span className="mt-1 block italic text-[#a78345] dark:text-[#c8a96b] font-light">
                  {current.accent}
                </span>
              </h1>
              <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-[#605c57] dark:text-gray-300">
                {current.copy}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onShop()}
                  className="bg-[#171717] dark:bg-[#c8a96b] px-7 py-4 text-[11px] font-bold tracking-[.14em] text-white dark:text-black transition-all hover:scale-105 rounded-full shadow-lg"
                >
                  {current.cta}
                </button>
                <button
                  onClick={() => document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-[#171717] dark:border-white/30 px-6 py-4 text-[11px] font-bold tracking-[.14em] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  EXPLORE NEW ARRIVALS
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden lg:min-h-0">
            <img
              src={photo(current.image, 1600)}
              alt="Luxury jewelry collection"
              className="h-full w-full object-cover hero-image-enter"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1e5e1]/30 dark:from-[#1a1715]/40 to-transparent" />
            <div className="absolute bottom-8 left-8 hidden border border-white/60 dark:border-white/20 bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl backdrop-blur-md sm:block shadow-lg">
              <p className="text-[9px] font-bold tracking-[.16em] text-[#a78345] dark:text-[#c8a96b]">A_S JEWELLERY SIGNATURE</p>
              <p className="mt-0.5 font-serif text-lg font-bold">Gold, made personal</p>
              {products[0] && (
                <button
                  onClick={() => onProduct(products[0])}
                  className="mt-1.5 text-[10px] font-bold tracking-[.12em] text-[#a78345] underline flex items-center gap-1"
                >
                  VIEW PRODUCT <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Slide Controls */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 sm:left-12">
          <button
            onClick={() => setSlide((slide + 3) % heroSlides.length)}
            aria-label="Previous slide"
            className="p-2 rounded-full bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-8 bg-[#171717] dark:bg-[#c8a96b]' : 'w-2 bg-[#9e968d]'
              }`}
            />
          ))}
          <button
            onClick={() => setSlide((slide + 1) % heroSlides.length)}
            aria-label="Next slide"
            className="p-2 rounded-full bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="border-y border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-black/5 dark:divide-white/5 md:grid-cols-5 md:divide-y-0">
          {[
            [Sparkles, 'Artisanal Craftsmanship'],
            [ShieldCheck, 'BIS Certified Gold'],
            [Check, 'Razorpay Secure Checkout'],
            [Truck, 'Insured Express Delivery'],
            [ArrowUpRight, '15-Day Easy Returns']
          ].map(([Icon, label]: any) => (
            <div key={label} className="flex items-center justify-center gap-3 px-4 py-5 text-[10px] sm:text-[11px] font-bold tracking-[.1em] text-[#4a4742] dark:text-gray-300">
              <Icon className="h-4 w-4 text-[#c8a96b]" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop By Category */}
      <section id="categories" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[.25em] text-[#a78345] dark:text-[#c8a96b] uppercase">DISCOVER THE EDIT</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-normal">Shop By Category</h2>
          </div>
          <button onClick={() => onShop()} className="hidden text-[11px] font-bold tracking-[.15em] text-[#a78345] underline sm:block">
            VIEW COMPLETE CATALOG →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 6).map((category, i) => (
            <button
              key={category.id}
              onClick={() => selectCategory(category.name)}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl text-left shadow-sm hover:shadow-xl transition-all ${
                i === 0 || i === 3 ? 'md:row-span-2 md:aspect-auto' : 'aspect-[4/5]'
              }`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={getOptimizedImageUrl(category.image, { width: 600, quality: 'auto' })}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <p className="font-serif text-2xl font-bold">{category.name}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold tracking-[.15em] text-[#e7d5a5] opacity-0 transition-all group-hover:opacity-100">
                  EXPLORE PIECES →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Best Sellers Section with Interactive Filters */}
      <section id="best-sellers" className="bg-[#faf8f4] dark:bg-zinc-900/60 py-20 border-y border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[.25em] text-[#a78345] dark:text-[#c8a96b] uppercase">MOST WANTED</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl">Best Sellers Collection</h2>
              <p className="mt-2 text-xs sm:text-sm text-[#77736d] dark:text-gray-400 max-w-lg">
                Our most sought-after certified diamond solitaires and pure gold creations, favored by connoisseurs.
              </p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] font-bold tracking-[.12em] scrollbar-none">
              {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBestSellerCategory(cat)}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    bestSellerCategory === cat
                      ? 'bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black shadow-md scale-105'
                      : 'bg-white dark:bg-zinc-800 text-[#77736d] hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products
              .filter(p => bestSellerCategory === 'All' || p.category === bestSellerCategory)
              .slice(0, 8)
              .map((p, idx) => (
                <article key={p.id} className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-[#f3ece6] dark:bg-zinc-800">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={getOptimizedImageUrl(p.image, { width: 600, quality: 'auto' })}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWishlist(p.id);
                      }}
                      aria-label={`Save ${p.name}`}
                      className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-[#171717] dark:text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Heart className={`h-4 w-4 ${wishlistIds.includes(p.id) ? 'fill-[#c8a96b] text-[#c8a96b]' : ''}`} />
                    </button>
                    <span className="absolute left-3.5 top-3.5 bg-gradient-to-r from-[#171717] to-[#3a3a3a] dark:from-[#c8a96b] dark:to-[#e7d5a5] px-3 py-1 text-[9px] font-extrabold tracking-[.15em] text-white dark:text-black rounded-full shadow-md">
                      #{idx + 1} BESTSELLER
                    </span>
                    <button
                      onClick={() => onAdd(p)}
                      className="absolute inset-x-4 bottom-4 translate-y-16 bg-[#171717] dark:bg-[#c8a96b] py-3.5 text-[11px] font-bold tracking-[.13em] text-white dark:text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO SHOPPING BAG</span>
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#a78345] dark:text-[#c8a96b]">
                      <span>{p.subCategory || p.category}</span>
                      <span className="flex items-center gap-1 text-black dark:text-white">
                        <Star className="w-3 h-3 fill-[#c8a96b] text-[#c8a96b]" />
                        {p.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3
                      onClick={() => onProduct(p)}
                      className="font-serif text-lg font-bold text-[#171717] dark:text-white hover:text-[#a78345] dark:hover:text-[#c8a96b] cursor-pointer transition-colors truncate"
                    >
                      {p.name}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-normal">
                      {p.description}
                    </p>

                    <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-black dark:text-white">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => onProduct(p)}
                        className="text-[10px] font-bold text-[#a78345] dark:text-[#c8a96b] uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onShop(bestSellerCategory === 'All' ? undefined : bestSellerCategory)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black text-xs font-bold tracking-[.15em] uppercase hover:scale-105 transition-all shadow-xl cursor-pointer"
            >
              EXPLORE ALL BEST SELLERS <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[.25em] text-[#a78345] dark:text-[#c8a96b] uppercase">JUST ARRIVED</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl">New In Atelier</h2>
          </div>
          <div className="flex gap-2 overflow-auto text-[11px] font-bold tracking-[.12em]">
            {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  tab === value
                    ? 'bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black'
                    : 'text-[#77736d] hover:text-black dark:hover:text-white'
                }`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.filter(p => tab === 'All' || p.category === tab).slice(0, 8).map(productCard)}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => selectCategory(tab)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#171717] dark:bg-[#c8a96b] text-white dark:text-black text-[11px] font-bold tracking-[.15em] uppercase hover:scale-105 transition-transform"
          >
            VIEW ALL {tab.toUpperCase()} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Editorial Feature Banner */}
      <section className="relative isolate overflow-hidden bg-[#171717] py-24 text-white">
        <img
          src={photo('photo-1599643478518-a784e5dc4c8f', 1600)}
          alt="Editorial jewelry showcase"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-16">
          <p className="text-[10px] font-bold tracking-[.25em] text-[#e7d5a5] uppercase">ATELIER MASTERPIECE</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">
            Designed to Be Remembered Always
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-white/80 leading-relaxed">
            Every gemstone is ethically handpicked and set in sovereign hallmarked gold by master artisans.
          </p>
          <button
            onClick={() => onShop()}
            className="mt-8 px-8 py-4 rounded-full border border-[#e7d5a5] text-[#e7d5a5] hover:bg-[#e7d5a5] hover:text-black text-[11px] font-bold tracking-[.15em] transition-colors uppercase"
          >
            DISCOVER THE EDIT
          </button>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 text-center md:px-10">
        <p className="text-[10px] font-bold tracking-[.25em] text-[#a78345] dark:text-[#c8a96b] uppercase">PATRON TESTIMONIALS</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-5xl">Stories From Our Patrons</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 text-left">
          {reviews.slice(0, 4).map(review => (
            <article key={review.id} className="border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm">
              <div className="flex text-[#c8a96b]">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 font-serif text-xl sm:text-2xl leading-snug text-[#171717] dark:text-white">
                “{review.text}”
              </p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <img src={review.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-[#c8a96b]/50" />
                <div>
                  <strong className="block text-sm text-[#171717] dark:text-white">{review.name}</strong>
                  <small className="text-[#77736d] dark:text-gray-400 font-medium">{review.role || 'Verified Patron'}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
