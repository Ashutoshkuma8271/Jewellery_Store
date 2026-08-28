import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  Grid,
  List,
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';
import { getOptimizedImageUrl } from '../utils/cloudinary';

interface ShopCollectionViewProps {
  products: Product[];
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

export const ShopCollectionView: React.FC<ShopCollectionViewProps> = ({
  products,
  initialCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (!initialCategory || initialCategory === 'all') return 'All';
    return initialCategory;
  });

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory === 'all' ? 'All' : initialCategory);
    }
  }, [initialCategory]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(250000);
  const [sortBy, setSortBy] = useState<string>('Popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // 36 items produce 6 full pages!

  const catalogTopRef = useRef<HTMLDivElement>(null);

  const shopProducts: Product[] = products.length > 0 ? products : [];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return shopProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          selectedCategory === 'All Categories' ||
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (p.subCategory && p.subCategory.toLowerCase() === selectedCategory.toLowerCase());
        const matchesPrice = p.price >= priceMin && p.price <= priceMax;
        return matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Price: High to Low') return b.price - a.price;
        if (sortBy === 'Newest Arrival') return b.id.localeCompare(a.id);
        return (b.reviewCount || 0) - (a.reviewCount || 0); // Popularity default
      });
  }, [shopProducts, selectedCategory, priceMin, priceMax, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, validCurrentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (catalogTopRef.current) {
        catalogTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceMin(0);
    setPriceMax(250000);
    setSortBy('Popularity');
    setCurrentPage(1);
  };

  // Category counts
  const categoryCounts = useMemo(() => shopProducts.reduce<Record<string, number>>((counts, product) => {
    counts['All Categories'] = shopProducts.length;
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, { 'All Categories': shopProducts.length }), [shopProducts]);

  const recentlyViewed = [
    {
      id: 'silk-scarf',
      name: 'Abstract Silk Scarf',
      price: 14999,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'cufflinks',
      name: 'Crest Silver Cufflinks',
      price: 18999,
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'vase',
      name: 'Obelisk Ceramic Vase',
      price: 12499,
      image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pen',
      name: 'Signature Fountain Pen',
      price: 9999,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'olive-wallet',
      name: 'Bifold Olive Wallet',
      price: 15999,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div ref={catalogTopRef} className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 sm:py-16 w-full space-y-10 sm:space-y-12 bg-[#faf8f4]">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400 uppercase">
            A_S JEWELLERY • INDIA
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-[#1c1b1b] dark:text-white mt-1">
            The Jewelry Collection
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Showing {filteredProducts.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0}–
            {Math.min(validCurrentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} luxury artisanal releases
          </p>
        </div>

        {/* View Toggles & Sort */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[#f5f1f0] dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm' : 'text-gray-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm' : 'text-gray-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#f5f1f0] dark:bg-zinc-800 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-black/5 dark:border-white/10 outline-none cursor-pointer text-black dark:text-white"
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrival</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Sidebar Filters (3 cols) */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
          
          <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
            <span className="font-semibold text-sm text-[#1c1b1b] dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Filters</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-bold"
            >
              Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h4>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-none">
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const isSelected =
                  selectedCategory === catName ||
                  (selectedCategory === 'All' && catName === 'All Categories');

                return (
                  <label
                    key={catName}
                    className={`flex items-center justify-between text-xs cursor-pointer py-1.5 px-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(catName === 'All Categories' ? 'All' : catName)}
                        className="accent-amber-500"
                      />
                      <span>{catName}</span>
                    </div>
                    <span className="text-gray-400 text-[10px] font-mono">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Enhanced Price Range Filter */}
          <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider">Price Filter</span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                {formatCurrency(priceMin)} – {formatCurrency(priceMax)}
              </span>
            </div>

            {/* Price Presets Chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { label: 'All Prices', min: 0, max: 250000 },
                { label: 'Under ₹10k', min: 0, max: 10000 },
                { label: '₹10k – ₹50k', min: 10000, max: 50000 },
                { label: '₹50k – ₹1.5L', min: 50000, max: 150000 },
                { label: 'Above ₹1.5L', min: 150000, max: 250000 },
              ].map((preset) => {
                const isActive = priceMin === preset.min && priceMax === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPriceMin(preset.min);
                      setPriceMax(preset.max);
                      setCurrentPage(1);
                    }}
                    className={`py-1 px-2 rounded-lg text-[10px] font-semibold text-center transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Range Slider for Price Ceiling */}
            <div className="space-y-1 pt-1">
              <label className="text-[10px] text-gray-400 font-semibold uppercase">Max Price Slider</label>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={priceMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceMax(val);
                  if (val < priceMin) setPriceMin(0);
                  setCurrentPage(1);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Min and Max Number Inputs */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Min (₹)</span>
                <input
                  type="number"
                  min={0}
                  max={priceMax}
                  value={priceMin}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    setPriceMin(val);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg text-xs font-mono border border-black/10 dark:border-white/10 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <span className="text-gray-400 pt-4 text-xs">–</span>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Max (₹)</span>
                <input
                  type="number"
                  min={priceMin}
                  max={300000}
                  value={priceMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPriceMax(val);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg text-xs font-mono border border-black/10 dark:border-white/10 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Artisanal Brands</h4>
            <div className="space-y-2">
              {['Luxe Furniture', 'Aura Audio', 'Maison Lighting', 'Santal Botanicals'].map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-black cursor-pointer py-0.5">
                  <input type="checkbox" defaultChecked className="accent-amber-500 rounded" />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</h4>
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
              <span className="text-xs font-semibold text-black dark:text-white ml-2">4.5 & Up</span>
            </div>
          </div>

        </div>

        {/* Right Products Catalog Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-10">
          
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 p-8 space-y-4">
              <p className="text-lg font-serif font-bold text-black dark:text-white">No products found</p>
              <p className="text-xs text-gray-500">Try loosening your filter criteria or price ceiling.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((p, index) => {
                const isFav = wishlistIds.includes(p.id);

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.05,
                      ease: [0.21, 0.47, 0.32, 0.98]
                    }}
                    className="group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] bg-[#f5f1f0] dark:bg-zinc-800 rounded-2xl overflow-hidden relative mb-4">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={getOptimizedImageUrl(p.image, { width: 600, quality: 'auto' })}
                        alt={p.name}
                        onError={handleImageError}
                        onClick={() => onSelectProduct(p)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {p.badge && (
                        <span className="absolute top-3 left-3 bg-black/80 dark:bg-white/80 backdrop-blur-md text-white dark:text-black text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-black dark:text-white'}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                          {p.category}
                        </p>
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{p.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(p)}
                        className="font-bold text-base text-[#1c1b1b] dark:text-white hover:underline truncate"
                      >
                        {p.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-base font-extrabold text-black dark:text-white">
                          {formatCurrency(p.price)}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(p);
                          }}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Interactive Pagination Section (At least 5 pages supported!) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-black/10 dark:border-white/10">
              <p className="text-xs font-medium text-gray-500">
                Page <span className="font-bold text-black dark:text-white">{validCurrentPage}</span> of{' '}
                <span className="font-bold text-black dark:text-white">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="p-2.5 rounded-xl bg-[#f5f1f0] dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === validCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[36px] h-9 px-3 rounded-xl font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-500/50'
                          : 'bg-[#f5f1f0] dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className="p-2.5 rounded-xl bg-[#f5f1f0] dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Recently Viewed Horizontal Section */}
      <div className="space-y-6 pt-8 border-t border-black/10 dark:border-white/10">
        <h3 className="text-xl font-serif font-bold text-[#1c1b1b] dark:text-white">Recently Viewed</h3>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {recentlyViewed.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="min-w-[200px] bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex-shrink-0"
            >
              <img
                loading="lazy"
                decoding="async"
                src={item.image}
                alt={item.name}
                onError={handleImageError}
                className="w-full h-36 object-cover rounded-xl mb-3"
              />
              <h4 className="font-semibold text-xs text-black dark:text-white truncate">{item.name}</h4>
              <p className="text-xs font-bold text-black dark:text-white mt-0.5">{formatCurrency(item.price)}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
