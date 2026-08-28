import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Eye, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';

interface EditorialPicksProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const EditorialPicks: React.FC<EditorialPicksProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const editorialProducts = products.filter(p => p.isEditorialPick || p.badge);

  return (
    <section className="bg-[#f7f3f2] dark:bg-zinc-900/60 py-16 w-full border-y border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#444748] dark:text-gray-400 uppercase">
              New Arrivals
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1c1b1b] dark:text-white mt-1">
              The Editorial Pick
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
        >
          {editorialProducts.map((item, index) => {
            const isWishlisted = wishlistIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="flex flex-col group min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start shrink-0"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#e5e2e1] dark:bg-zinc-800 mb-4 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest shadow-sm">
                      {item.badge}
                    </span>
                  )}

                  {/* Action Floating Buttons */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-100 translate-x-0 sm:translate-x-12 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(item.id);
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-colors ${
                        isWishlisted
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 dark:bg-zinc-900/90 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(item);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 text-black dark:text-white backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Slide-Up Add To Cart Button */}
                  <button
                    onClick={() => onAddToCart(item)}
                    className="absolute bottom-0 inset-x-0 py-3.5 bg-black/90 dark:bg-white/90 text-white dark:text-black backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-lg text-[#1c1b1b] dark:text-white truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-[#1c1b1b] dark:text-white">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-semibold tracking-wider text-[#444748] dark:text-gray-400 uppercase">
                    {item.category} {item.subCategory ? `/ ${item.subCategory}` : ''}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-base text-[#1c1b1b] dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
