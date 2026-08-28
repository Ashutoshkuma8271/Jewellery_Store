import React from 'react';

// High reliability fallback images for products and avatars
export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
export const DEFAULT_AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_PRODUCT_FALLBACK
) => {
  const target = e.currentTarget;
  if (target.src !== fallbackSrc) {
    target.onerror = null; // Prevent infinite loop if fallback fails
    target.src = fallbackSrc;
  }
};
