import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 25000;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 999;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'AS15VIP' || code === 'LUXE15VIP' || code === 'FESTIVE15') {
      setDiscountPercent(15);
      setPromoApplied(true);
    } else if (code === 'AS10' || code === 'LUXE10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else if (code === 'MIDNIGHT60') {
      setDiscountPercent(60);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Try AS15VIP or FESTIVE15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col text-[#1c1b1b] dark:text-white transition-colors">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black dark:text-white" />
              <h3 className="font-bold font-serif text-lg">Your Shopping Bag</h3>
              <span className="text-xs bg-[#f1edec] dark:bg-zinc-800 px-2.5 py-0.5 rounded-full font-bold">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#f7f3f2] dark:bg-zinc-800/50 px-6 py-3 border-b border-black/5 dark:border-white/5">
            {amountToFreeShipping === 0 ? (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                You unlocked Complimentary Express Doorstep Shipping!
              </p>
            ) : (
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Add <span className="font-bold text-black dark:text-white">{formatCurrency(amountToFreeShipping)}</span> more to unlock Complimentary Express Shipping.
              </p>
            )}

            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f1edec] dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-base">Your shopping bag is empty</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Explore our curated collections to add items.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 pb-4 border-b border-black/5 dark:border-white/10"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={handleImageError}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100 dark:bg-zinc-800"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 uppercase mt-0.5">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-extrabold text-sm text-black dark:text-white">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#f7f3f2] dark:bg-zinc-850 border-t border-black/5 dark:border-white/10 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. AS15VIP)"
                    className="w-full bg-white dark:bg-zinc-800 text-xs pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 outline-none uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ {discountPercent}% VIP Discount Applied!
                </p>
              )}
              {promoError && (
                <p className="text-xs text-red-500">{promoError}</p>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-black/5 dark:border-white/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black dark:text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>VIP Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Express Shipping</span>
                  <span className="font-semibold text-black dark:text-white">
                    {shipping === 0 ? 'COMPLIMENTARY' : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-black dark:text-white pt-2 border-t border-black/10 dark:border-white/10">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
