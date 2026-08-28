import React, { useState, useRef } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Check, Truck, Rotate3d, ZoomIn, MapPin, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

const SPIN_PREVIEWS = [
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
];

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(
    product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Obsidian');

  // Interactive modes
  const [is360Mode, setIs360Mode] = useState(false);
  const [spinIdx, setSpinIdx] = useState(0);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const modalImgRef = useRef<HTMLDivElement>(null);

  // Pincode
  const [quickPincode, setQuickPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPincode.length >= 5) {
      setPincodeMessage('🚚 Express Shipping Available to ' + quickPincode + ' (Delivery by Tomorrow)');
    } else {
      setPincodeMessage('Please enter a valid Pincode.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalImgRef.current) return;
    const { left, top, width, height } = modalImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      ></div>

      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl z-10 text-[#1c1b1b] dark:text-white max-h-[90vh] overflow-y-auto border border-black/5 dark:border-white/10 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Gallery & Interactive Viewer */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm border border-black/5 dark:border-white/5 relative group">
              
              {/* Interactive Controls Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 z-20">
                <button
                  onClick={() => setIsZoomMode(!isZoomMode)}
                  className={`p-2 rounded-full backdrop-blur-md text-xs font-bold transition-all ${
                    isZoomMode ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white/80 dark:bg-zinc-900/80'
                  }`}
                  title="Toggle Zoom Lens"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIs360Mode(!is360Mode)}
                  className={`p-2 rounded-full backdrop-blur-md text-xs font-bold transition-all ${
                    is360Mode ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-zinc-900/80'
                  }`}
                  title="Toggle 360 Spin View"
                >
                  <Rotate3d className="w-4 h-4" />
                </button>
              </div>

              {is360Mode ? (
                <div className="w-full h-full flex flex-col justify-between p-4">
                  <img src={SPIN_PREVIEWS[spinIdx]} alt="" onError={handleImageError} className="w-full h-full object-contain" />
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-xl backdrop-blur-md border border-black/10">
                    <span className="text-[10px] font-bold">360° SPIN</span>
                    <input
                      type="range"
                      min="0"
                      max={SPIN_PREVIEWS.length - 1}
                      value={spinIdx}
                      onChange={(e) => setSpinIdx(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              ) : isZoomMode ? (
                <div
                  ref={modalImgRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomPos((p) => ({ ...p, show: false }))}
                  className="w-full h-full relative cursor-crosshair"
                >
                  <img src={selectedImage} alt={product.name} onError={handleImageError} className="w-full h-full object-cover pointer-events-none" />
                  {zoomPos.show && (
                    <div
                      className="absolute pointer-events-none border-2 border-amber-500 rounded-full shadow-2xl overflow-hidden"
                      style={{
                        width: '140px',
                        height: '140px',
                        top: `calc(${zoomPos.y}% - 70px)`,
                        left: `calc(${zoomPos.x}% - 70px)`,
                        backgroundImage: `url(${selectedImage})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '300%'
                      }}
                    />
                  )}
                </div>
              ) : (
                <img
                  src={selectedImage}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              )}
            </div>

            {galleryImages.length > 1 && !is360Mode && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(img);
                      setIs360Mode(false);
                    }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img && !is360Mode
                        ? 'border-black dark:border-white scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.badge && (
                  <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  {product.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
                </div>
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock in India
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-black dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                Special Offer
              </span>
            </div>

            {/* Bank Offer Badge */}
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Get 10% Instant Discount on HDFC Bank Cards with code <strong>AS10</strong></span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Pincode Quick Checker */}
            <form onSubmit={handlePincodeCheck} className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Delivery Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={quickPincode}
                  onChange={(e) => setQuickPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="flex-1 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl text-xs border border-black/10 dark:border-white/10 outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-xl"
                >
                  Check
                </button>
              </div>
              {pincodeMessage && (
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{pincodeMessage}</p>
              )}
            </form>

            {/* Quantity and Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex items-center justify-between border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 min-w-[120px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="font-bold text-lg text-gray-500 hover:text-black dark:hover:text-white"
                >
                  -
                </button>
                <span className="font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="font-bold text-lg text-gray-500 hover:text-black dark:hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — {formatCurrency(product.price * quantity)}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-500'
                    : 'border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
                title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
