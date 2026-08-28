import React from 'react';
import { X, User, Package, ShieldCheck, Heart, MapPin } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  wishlistCount: number;
  user?: {
    name: string;
    email: string;
    avatar: string;
    memberTier: string;
    phone: string;
  } | null;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  cartCount,
  wishlistCount,
  user,
  onNavigate,
  onLogout
}) => {
  if (!isOpen) return null;

  const displayName = user?.name || 'Alexander Sterling';
  const displayEmail = user?.email || 'patron@asjewellery.com';
  const displayAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const displayTier = user?.memberTier || 'A_S JEWELLERY VIP Patron';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md"></div>

      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full p-8 shadow-2xl z-10 text-[#1c1b1b] dark:text-white border border-black/5 dark:border-white/10 transition-colors space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-amber-500/50"
            />
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-[11px] text-gray-400 font-mono">{displayEmail}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {displayTier}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-[#f7f3f2] dark:bg-zinc-800/60 rounded-2xl text-center space-y-0.5">
            <p className="text-xl font-bold">{cartCount}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Items in Bag</p>
          </div>

          <div className="p-4 bg-[#f7f3f2] dark:bg-zinc-800/60 rounded-2xl text-center space-y-0.5">
            <p className="text-xl font-bold">{wishlistCount}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Saved Wishlist</p>
          </div>

          <div className="p-4 bg-[#f7f3f2] dark:bg-zinc-800/60 rounded-2xl text-center space-y-0.5">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">12</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Completed Orders</p>
          </div>
        </div>

        {/* Recent Order History */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
              <Package className="w-4 h-4 text-black dark:text-white" />
              Recent Luxury Shipments
            </h4>
            <span className="text-xs text-amber-600 font-semibold">Active Concierge</span>
          </div>

          <div className="space-y-2">
            <div className="p-4 bg-[#f7f3f2] dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <p className="font-bold">#LX-928401 — The Obsidian Lounge Chair</p>
                <p className="text-gray-500 mt-0.5">Placed on July 20, 2026 • Express Courier</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold rounded-full text-[10px]">
                In Transit
              </span>
            </div>

            <div className="p-4 bg-[#f7f3f2] dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <p className="font-bold">#LX-817290 — Terraform Sculptural Lamp</p>
                <p className="text-gray-500 mt-0.5">Delivered on June 14, 2026</p>
              </div>
              <span className="px-2.5 py-1 bg-gray-200 dark:bg-zinc-700 font-bold rounded-full text-[10px]">
                Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Address & Preferences */}
        <div className="p-4 border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-bold">Primary VIP Address</p>
              <p className="text-gray-500">450 Via Montenapoleone, Milan, Italy</p>
            </div>
          </div>
          <button className="text-xs font-bold underline hover:text-amber-600">Edit</button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
        >
          Close Account View
        </button>
      </div>
    </div>
  );
};
