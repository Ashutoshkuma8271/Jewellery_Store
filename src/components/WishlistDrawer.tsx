import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col text-[#1c1b1b] dark:text-white transition-colors">
          
          {/* Header */}
          <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h3 className="font-semibold text-lg">Your Saved Favorites</h3>
              <span className="text-xs bg-[#f1edec] dark:bg-zinc-800 px-2 py-0.5 rounded-full font-bold">
                {wishlistProducts.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-base">No saved items yet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click the heart icon on any product to save it for later.
                  </p>
                </div>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 pb-4 border-b border-black/5 dark:border-white/10 items-center"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={handleImageError}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100 dark:bg-zinc-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-semibold text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-gray-500 uppercase">{p.category}</p>
                    <p className="font-semibold text-sm">{formatCurrency(p.price)}</p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          onRemoveFromWishlist(p.id);
                        }}
                        className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
