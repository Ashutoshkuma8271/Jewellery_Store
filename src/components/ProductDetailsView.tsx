import React, { useState, useRef, useMemo } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Check,
  Play,
  ChevronLeft,
  ChevronRight,
  Rotate3d,
  ZoomIn,
  MapPin,
  Tag,
  CreditCard,
  Percent,
  Sparkles,
  RefreshCw,
  Share2,
  Copy,
  ThumbsUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';
import { getOptimizedImageUrl } from '../utils/cloudinary';
import { PRODUCTS } from '../data/jewelryData';

interface ProductDetailsViewProps {
  product?: Product;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  wishlistIds?: string[];
  onNavigateToCheckout: (product: Product) => void;
}

const THREE_SIXTY_FRAMES = [
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'
];

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  wishlistIds,
  onNavigateToCheckout
}) => {
  // Default product if none provided
  const currentProduct: Product = product || {
    id: 'titan-x1',
    name: 'Titan X-1 Ergonomic Lounger',
    category: 'Furniture',
    price: 124999,
    originalPrice: 149999,
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
    description: 'The ultimate evolution of comfort and form. Crafted with genuine full-grain leather, solid walnut frame, and zero-gravity recline mechanics.',
    inStock: true
  };

  const images = [
    currentProduct.image,
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  ];

  const [activeImage, setActiveImage] = useState(0);
  const [viewMode, setViewMode] = useState<'standard' | '360' | 'zoom'>('standard');
  const [spinIndex, setSpinIndex] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  // Zoom lens states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Selections
  const [selectedFinish, setSelectedFinish] = useState('Obsidian Leather');
  const [selectedSize, setSelectedSize] = useState('Standard Size');
  const [activeTab, setActiveTab] = useState('Description');

  // Pincode & Delivery State (Flipkart/Myntra style)
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string; cod: boolean } | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Coupon applied state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState('');

  // Frequently Bought Together Bundle state
  const [includePolish, setIncludePolish] = useState(true);
  const [includeOttoman, setIncludeOttoman] = useState(true);

  // Copy share link toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Recommendations scroll ref and scroll action
  const recommendedScrollRef = useRef<HTMLDivElement>(null);

  const scrollRecommended = (direction: 'left' | 'right') => {
    if (recommendedScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      recommendedScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Recommended products filtering based on category and tags
  const recommendedProducts = useMemo(() => {
    const catalog = products && products.length > 0 ? products : PRODUCTS;
    const currCategory = (currentProduct.category || '').toLowerCase();
    const currSubCategory = (currentProduct.subCategory || '').toLowerCase();
    const currTags = (currentProduct.tags || []).map((t) => t.toLowerCase());

    const currKeywords = [
      ...currCategory.split(/\s+/),
      ...currSubCategory.split(/\s+/),
      ...(currentProduct.name || '').toLowerCase().split(/\s+/),
      ...currTags
    ].filter((w) => w.length > 2);

    const scored = catalog
      .filter((p) => p.id !== currentProduct.id)
      .map((p) => {
        let score = 0;
        let matchReason = '';

        const pCategory = (p.category || '').toLowerCase();
        const pSubCategory = (p.subCategory || '').toLowerCase();
        const pTags = (p.tags || []).map((t) => t.toLowerCase());

        // Category match
        if (pCategory === currCategory && currCategory) {
          score += 15;
          matchReason = `Same Category: ${p.category}`;
        }

        // SubCategory match
        if (pSubCategory === currSubCategory && currSubCategory) {
          score += 10;
          if (!matchReason) matchReason = `Similar Type: ${p.subCategory}`;
        }

        // Tag overlap match
        if (currTags.length > 0 && pTags.length > 0) {
          const sharedTags = pTags.filter((t) => currTags.includes(t));
          if (sharedTags.length > 0) {
            score += sharedTags.length * 8;
            matchReason = `Matching Tag: #${sharedTags[0]}`;
          }
        }

        // Word overlap match in title/description/tags
        const pText = `${p.name} ${p.description || ''} ${pTags.join(' ')}`.toLowerCase();
        const matchingKeywords = currKeywords.filter((kw) => pText.includes(kw));
        score += matchingKeywords.length * 2;

        // Rating bonus
        score += (p.rating || 4.5) * 0.5;

        if (!matchReason) {
          matchReason = p.category ? `Top Pick in ${p.category}` : 'Recommended';
        }

        return { product: p, score, matchReason };
      });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.map((item) => ({
      ...item.product,
      matchReason: item.matchReason
    }));
  }, [currentProduct, products]);

  // Pincode verification logic
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 5) {
      setPincodeStatus({ checked: true, valid: false, message: 'Please enter a valid 6-digit Pincode.', cod: false });
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus({
        checked: true,
        valid: true,
        message: 'Delivery by Tomorrow, 4:00 PM • Free Shipping',
        cod: true
      });
    }, 400);
  };

  // Zoom lens mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  // 360 Spin auto timer
  React.useEffect(() => {
    let timer: any;
    if (isAutoSpinning && viewMode === '360') {
      timer = setInterval(() => {
        setSpinIndex((prev) => (prev + 1) % THREE_SIXTY_FRAMES.length);
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isAutoSpinning, viewMode]);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'AS10' || code === 'LUXE10' || code === 'FESTIVE15' || code === 'AS15VIP') {
      setAppliedDiscount(15);
      setCouponMsg('15% Atelier VIP Discount Applied Successfully!');
    } else {
      setCouponMsg('Invalid Coupon Code. Try AS10, AS15VIP, or FESTIVE15.');
      setAppliedDiscount(0);
    }
  };

  const getDirectUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    return `${origin}${pathname}?product=${currentProduct.id}`;
  };

  const handleShare = () => {
    const shareUrl = getDirectUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppChat = () => {
    const shareUrl = getDirectUrl();
    const message = `Hi! I am interested in *${currentProduct.name}* (Price: ${formatCurrency(currentProduct.price)}).\n\nDirect link: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const bundleBasePrice = currentProduct.price;
  const polishPrice = includePolish ? 2499 : 0;
  const ottomanPrice = includeOttoman ? 24999 : 0;
  const totalBundlePrice = (bundleBasePrice + polishPrice + ottomanPrice) * 0.85; // 15% bundle deal discount

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 w-full space-y-16 animate-in fade-in duration-300">
      
      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Thumbnails (2 cols on large) */}
        <div className="lg:col-span-2 hidden lg:flex flex-col gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImage(idx);
                setViewMode('standard');
              }}
              className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative ${
                activeImage === idx && viewMode === 'standard'
                  ? 'border-black dark:border-white shadow-md scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}

          {/* 360 View Mode Button Thumbnail */}
          <button
            onClick={() => setViewMode('360')}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
              viewMode === '360'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                : 'border-black/10 dark:border-white/10 text-gray-500 hover:border-black/30'
            }`}
          >
            <Rotate3d className="w-6 h-6 text-amber-500 mb-1 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-wider">360° Spin</span>
          </button>
        </div>

        {/* Main Interactive Viewer Display (5 cols) */}
        <div className="lg:col-span-5 bg-[#f5f1f0] dark:bg-zinc-800/80 rounded-3xl p-6 relative overflow-hidden group aspect-square flex items-center justify-center shadow-sm">
          
          {/* Top Badges */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
            <span className="px-3.5 py-1.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
              Handcrafted Masterpiece
            </span>
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm animate-pulse">
              🔥 Only 3 Left
            </span>
          </div>

          {/* View Mode Action Controls Top-Right */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
            <button
              onClick={() => setViewMode(viewMode === 'zoom' ? 'standard' : 'zoom')}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                viewMode === 'zoom'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-110'
                  : 'bg-white/80 text-black dark:bg-zinc-900/80 dark:text-white hover:bg-white'
              }`}
              title="Toggle Zoom Lens"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode(viewMode === '360' ? 'standard' : '360')}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                viewMode === '360'
                  ? 'bg-amber-500 text-white shadow-lg scale-110'
                  : 'bg-white/80 text-black dark:bg-zinc-900/80 dark:text-white hover:bg-white'
              }`}
              title="Toggle 360° View"
            >
              <Rotate3d className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/80 text-black dark:bg-zinc-900/80 dark:text-white hover:bg-white backdrop-blur-md transition-all"
              title="Share Product"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* 360° Interactive Viewer Mode */}
          {viewMode === '360' ? (
            <div className="w-full h-full flex flex-col items-center justify-between p-4 relative z-10">
              <div className="w-full h-full flex items-center justify-center relative">
                <img
                  src={THREE_SIXTY_FRAMES[spinIndex]}
                  alt="360 View"
                  className="w-full h-full object-contain transition-all duration-150 select-none cursor-grab active:cursor-grabbing"
                />
              </div>

              {/* 360 Interactive Rotator Controls */}
              <div className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-between gap-4 shadow-lg">
                <button
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isAutoSpinning
                      ? 'bg-amber-500 text-white'
                      : 'bg-black text-white dark:bg-white dark:text-black'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAutoSpinning ? 'animate-spin' : ''}`} />
                  <span>{isAutoSpinning ? 'Auto-Spinning' : 'Play 360°'}</span>
                </button>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500 font-bold">0°</span>
                  <input
                    type="range"
                    min="0"
                    max={THREE_SIXTY_FRAMES.length - 1}
                    value={spinIndex}
                    onChange={(e) => setSpinIndex(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-gray-500 font-bold">360°</span>
                </div>
              </div>
            </div>
          ) : viewMode === 'zoom' ? (
            /* Interactive Zoom Magnifier Mode */
            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomPos((p) => ({ ...p, show: false }))}
              className="w-full h-full relative cursor-crosshair overflow-hidden rounded-2xl"
            >
              <img
                src={images[activeImage]}
                alt={currentProduct.name}
                className="w-full h-full object-contain pointer-events-none"
              />

              {zoomPos.show && (
                <div
                  className="absolute pointer-events-none border-2 border-amber-500 rounded-full shadow-2xl overflow-hidden bg-white dark:bg-zinc-900"
                  style={{
                    width: '180px',
                    height: '180px',
                    top: `calc(${zoomPos.y}% - 90px)`,
                    left: `calc(${zoomPos.x}% - 90px)`,
                    backgroundImage: `url(${images[activeImage]})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '350%'
                  }}
                />
              )}

              <div className="absolute bottom-4 left-4 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                Move cursor to inspect texture details
              </div>
            </div>
          ) : (
            /* Standard View Mode */
            <img
              loading="lazy"
              decoding="async"
              src={getOptimizedImageUrl(images[activeImage], { width: 900, quality: 'auto' })}
              alt={currentProduct.name}
              onError={handleImageError}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
          )}

          {/* Mobile Gallery Thumbnails Row */}
          <div className="flex lg:hidden gap-2.5 overflow-x-auto pb-2 scrollbar-none w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(idx);
                  setViewMode('standard');
                }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImage === idx && viewMode === 'standard'
                    ? 'border-black dark:border-white ring-2 ring-amber-500/50 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" onError={handleImageError} className="w-full h-full object-cover" />
              </button>
            ))}

            <button
              onClick={() => setViewMode('360')}
              className={`w-14 h-14 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center p-1 text-center transition-all ${
                viewMode === '360'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                  : 'border-black/10 dark:border-white/10 text-gray-500'
              }`}
            >
              <Rotate3d className="w-4 h-4 text-amber-500 mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">360°</span>
            </button>
          </div>
        </div>

        {/* Product Details Specs & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              A_S JEWELLERY SIGNATURE COLLECTION
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#1c1b1b] dark:text-white">
              {currentProduct.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex flex-wrap items-center gap-3 text-sm pt-1">
              <div className="flex items-center text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold text-xs">
                <span>{currentProduct.rating}</span>
                <Star className="w-3.5 h-3.5 fill-amber-500 ml-1" />
              </div>
              <span className="text-gray-500 font-medium text-xs">124 Verified Reviews</span>
              <span className="text-gray-300 dark:text-zinc-700">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready to Ship
              </span>
            </div>
          </div>

          {/* Pricing & EMI Banner */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/10 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#1c1b1b] dark:text-white">
                {formatCurrency(currentProduct.price - (currentProduct.price * (appliedDiscount / 100)))}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(currentProduct.originalPrice)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                15% OFF
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium pt-1 border-t border-black/5 dark:border-white/5">
              <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
              <span>No-Cost EMI starting at <strong>₹3,499/month</strong> with major bank cards.</span>
            </div>
          </div>

          {/* Flipkart / Myntra Style Bank Offers Breakdown */}
          <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Available Bank Offers & Coupons</span>
            </div>

            <ul className="space-y-2 text-xs text-black dark:text-gray-200">
              <li className="flex items-start gap-2">
                <Percent className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Bank Offer:</strong> 10% Instant Discount up to ₹1,500 on HDFC Bank Credit Cards.</span>
              </li>
              <li className="flex items-start gap-2">
                <Percent className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Special Coupon:</strong> Apply coupon <strong>AS10</strong>, <strong>AS15VIP</strong> or <strong>FESTIVE15</strong> for extra savings.</span>
              </li>
            </ul>

            {/* Coupon Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon (e.g. FESTIVE15)"
                className="flex-1 bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl text-xs border border-black/10 dark:border-white/10 uppercase font-mono outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs font-bold ${appliedDiscount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* Pincode & Delivery Availability Checker (Flipkart/Myntra style) */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Check Delivery & Cash on Delivery</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 110001)"
                className="flex-1 bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl text-xs border border-black/10 dark:border-white/10 font-mono outline-none"
              />
              <button
                type="submit"
                disabled={isCheckingPincode}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isCheckingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>

            {pincodeStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                pincodeStatus.valid
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
              }`}>
                {pincodeStatus.valid ? <Check className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                <div>
                  <p className="font-bold">{pincodeStatus.message}</p>
                  {pincodeStatus.cod && <p className="text-[10px] text-gray-500">💵 Pay on Delivery Available</p>}
                </div>
              </div>
            )}
          </div>

          {/* Color Finish Selection Swatches */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Material Finish: <span className="text-black dark:text-white font-semibold">{selectedFinish}</span>
            </label>
            <div className="flex gap-3">
              {[
                { name: 'Obsidian Leather', color: 'bg-zinc-900' },
                { name: 'Cognac Saddle', color: 'bg-amber-800' },
                { name: 'Champagne Cream', color: 'bg-amber-100' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedFinish(item.name)}
                  className={`w-9 h-9 rounded-full ${item.color} p-0.5 border-2 transition-all flex items-center justify-center ${
                    selectedFinish === item.name ? 'ring-2 ring-amber-500 ring-offset-2' : 'border-transparent'
                  }`}
                >
                  {selectedFinish === item.name && <Check className="w-4 h-4 text-white dark:text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={() => onAddToCart(currentProduct)}
                className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={() => onToggleWishlist(currentProduct.id)}
                className={`p-4 rounded-2xl border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-900'
                    : 'bg-[#f5f1f0] dark:bg-zinc-800 border-transparent text-black dark:text-white hover:border-black/20 dark:hover:border-white/20'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => onNavigateToCheckout(currentProduct)}
              className="w-full py-4 border-2 border-black dark:border-white font-bold text-xs tracking-wider uppercase rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              BUY IT NOW
            </button>

            {/* Share & WhatsApp Secondary Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Direct Link Share Button */}
              <button
                onClick={handleShare}
                className="py-3 px-4 bg-gray-100 dark:bg-zinc-800/90 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-black/5 dark:border-white/10"
                title="Copy direct product URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">URL COPIED!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-600" />
                    <span>SHARE LINK</span>
                  </>
                )}
              </button>

              {/* Chat with WhatsApp Button */}
              <button
                onClick={handleWhatsAppChat}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                title="Chat or inquire about this product on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WHATSAPP CHAT</span>
              </button>
            </div>

            {/* Link Copied Feedback Toast */}
            {copiedLink && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">Direct URL copied: <strong className="font-mono text-[11px]">{getDirectUrl()}</strong></span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Frequently Bought Together Bundle (Myntra/Amazon style) */}
      <div className="p-8 bg-gray-50 dark:bg-zinc-900/60 rounded-3xl border border-black/5 dark:border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400 uppercase">
              RECOMMENDED COMBINATION
            </p>
            <h3 className="text-xl font-bold font-serif text-[#1c1b1b] dark:text-white mt-0.5">
              Frequently Bought Together
            </h3>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-500/20">
            SAVE 15% ON BUNDLE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Product */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <img src={currentProduct.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
            <div>
              <p className="font-bold text-xs text-black dark:text-white">{currentProduct.name}</p>
              <p className="text-xs font-semibold text-amber-600">{formatCurrency(bundleBasePrice)}</p>
            </div>
          </div>

          {/* Accessory 1: Polish */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <input
              type="checkbox"
              checked={includePolish}
              onChange={(e) => setIncludePolish(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=200&q=80" alt="" className="w-14 h-14 object-cover rounded-xl" />
            <div>
              <p className="font-bold text-xs text-black dark:text-white">Leather Care Conditioning Kit</p>
              <p className="text-xs font-semibold text-amber-600">₹2,499</p>
            </div>
          </div>

          {/* Accessory 2: Ottoman */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <input
              type="checkbox"
              checked={includeOttoman}
              onChange={(e) => setIncludeOttoman(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80" alt="" className="w-14 h-14 object-cover rounded-xl" />
            <div>
              <p className="font-bold text-xs text-black dark:text-white">Matching Leather Ottoman</p>
              <p className="text-xs font-semibold text-amber-600">₹24,999</p>
            </div>
          </div>
        </div>

        {/* Total Bundle Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
          <div>
            <p className="text-xs text-gray-500 font-medium">Combined Bundle Price (15% Bundle Discount Included):</p>
            <p className="text-2xl font-bold text-black dark:text-white">{formatCurrency(totalBundlePrice)}</p>
          </div>

          <button
            onClick={() => onAddToCart(currentProduct)}
            className="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-bold text-xs rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ADD BUNDLE TO BAG</span>
          </button>
        </div>
      </div>

      {/* Tabs & Full Feature Breakdown */}
      <div className="space-y-8 border-t border-black/10 dark:border-white/10 pt-12">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-black/10 dark:border-white/10 overflow-x-auto">
          {['Description', 'Specifications', 'Customer Reviews (124)', 'Shipping & Support'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-black text-black dark:border-white dark:text-white font-bold'
                  : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold text-[#1c1b1b] dark:text-white leading-snug">
              Uncompromising luxury engineered for daily living.
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Every curve of this piece is handcrafted by master artisans, blending ergonomic posture science with timeless Scandinavian and Indian aesthetic sensibilities.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-black dark:text-white font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong>Walnut Frame:</strong> Sustainably harvested, hand-oiled solid walnut structure.
                </div>
              </li>

              <li className="flex items-start gap-3 text-sm text-black dark:text-white font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong>Full-Grain Leather:</strong> Premium, breathable leather that develops a rich patina over time.
                </div>
              </li>
            </ul>
          </div>

          {/* Video Preview Box with Play Overlay */}
          <div className="aspect-video bg-zinc-900 rounded-3xl relative overflow-hidden group shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
              alt="Video Preview"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <button className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-black ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended for You Section */}
      <div className="space-y-6 pt-12 border-t border-black/10 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <p className="text-[10px] font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400 uppercase">
                Curated Similar Pieces
              </p>
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#1c1b1b] dark:text-white">
              Recommended for You
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Filtered by category <strong className="text-black dark:text-white">"{currentProduct.category}"</strong></span>
              {currentProduct.tags && currentProduct.tags.length > 0 && (
                <>
                  <span>& tags:</span>
                  {currentProduct.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRecommended('left')}
              aria-label="Scroll left"
              className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRecommended('right')}
              aria-label="Scroll right"
              className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={recommendedScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {recommendedProducts.slice(0, 8).map((rec) => {
            const inWishlist = wishlistIds ? wishlistIds.includes(rec.id) : false;
            return (
              <div
                key={rec.id}
                className="w-[280px] sm:w-[300px] shrink-0 snap-start group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-[#f5f1f0] dark:bg-zinc-800 rounded-2xl overflow-hidden relative mb-3">
                    {/* Badge */}
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-black text-[9px] font-bold tracking-wider uppercase rounded-full shadow-xs">
                      {rec.matchReason || rec.category}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(rec.id);
                      }}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors shadow-xs"
                      aria-label="Wishlist item"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <img
                      src={rec.image}
                      alt={rec.name}
                      onError={handleImageError}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(rec);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div onClick={() => { if (onSelectProduct) onSelectProduct(rec); }}>
                    <div className="flex items-center justify-between gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">
                      <span>{rec.category}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rec.rating}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#1c1b1b] dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {rec.name}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">
                      {formatCurrency(rec.price)}
                    </p>
                    {rec.originalPrice && rec.originalPrice > rec.price && (
                      <p className="text-[10px] text-gray-400 line-through">
                        {formatCurrency(rec.originalPrice)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(rec);
                    }}
                    className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity flex items-center gap-1.5 text-[11px] font-bold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
