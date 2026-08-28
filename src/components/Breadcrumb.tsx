import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Product } from '../types';

interface BreadcrumbProps {
  currentView: 'home' | 'shop' | 'dashboard' | 'orders' | 'product' | 'checkout' | 'about' | 'contact' | 'addresses' | 'verify-email' | 'admin';
  activeCategory: string;
  selectedProduct: Product | null;
  onNavigateView: (view: any) => void;
  onSelectCategory?: (category: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentView,
  activeCategory,
  selectedProduct,
  onNavigateView,
  onSelectCategory
}) => {
  // Build breadcrumb items based on state
  const items: { label: string; action?: () => void; isCurrent?: boolean }[] = [
    {
      label: 'Home',
      action: () => {
        if (onSelectCategory) onSelectCategory('all');
        onNavigateView('home');
      }
    }
  ];

  if (currentView === 'home') {
    if (activeCategory && activeCategory !== 'all') {
      items.push({
        label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
        isCurrent: true
      });
    } else {
      items[0].isCurrent = true;
    }
  } else if (currentView === 'shop') {
    items.push({
      label: 'Shop Catalog',
      action: () => {
        if (onSelectCategory) onSelectCategory('all');
        onNavigateView('shop');
      },
      isCurrent: activeCategory === 'all'
    });

    if (activeCategory && activeCategory !== 'all') {
      items.push({
        label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
        isCurrent: true
      });
    }
  } else if (currentView === 'product') {
    items.push({
      label: 'Shop Catalog',
      action: () => {
        if (onSelectCategory) onSelectCategory('all');
        onNavigateView('shop');
      }
    });

    if (selectedProduct?.category) {
      items.push({
        label: selectedProduct.category,
        action: () => {
          if (onSelectCategory) onSelectCategory(selectedProduct.category.toLowerCase());
          onNavigateView('shop');
        }
      });
    }

    items.push({
      label: selectedProduct ? selectedProduct.name : 'Product Details',
      isCurrent: true
    });
  } else if (currentView === 'dashboard') {
    items.push({
      label: 'Your Account',
      isCurrent: true
    });
  } else if (currentView === 'orders') {
    items.push({
      label: 'Your Account',
      action: () => onNavigateView('dashboard')
    });
    items.push({
      label: 'Order History',
      isCurrent: true
    });
  } else if (currentView === 'checkout') {
    items.push({
      label: 'Shop Catalog',
      action: () => onNavigateView('shop')
    });
    items.push({
      label: 'Secure Checkout',
      isCurrent: true
    });
  } else if (currentView === 'about') {
    items.push({
      label: 'About A_S JEWELLERY',
      isCurrent: true
    });
  } else if (currentView === 'contact') {
    items.push({
      label: 'Contact & Showroom',
      isCurrent: true
    });
  } else if (currentView === 'addresses') {
    items.push({
      label: 'Your Account',
      action: () => onNavigateView('dashboard')
    });
    items.push({
      label: 'Address Book',
      isCurrent: true
    });
  } else if (currentView === 'verify-email') {
    items.push({
      label: 'Email Verification',
      isCurrent: true
    });
  } else if (currentView === 'admin') {
    items.push({
      label: 'A_S JEWELLERY Admin Suite',
      isCurrent: true
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-[#fdf8f8]/80 dark:bg-zinc-950/80 backdrop-blur-xs pt-24 pb-2 border-b border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;

            return (
              <li key={idx} className="flex items-center gap-1.5 min-w-0">
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 shrink-0" />
                )}

                {item.isCurrent ? (
                  <span className="font-bold text-black dark:text-white truncate max-w-[200px] sm:max-w-[320px]" title={item.label}>
                    {idx === 0 && <Home className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />}
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={item.action}
                    className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 hover:underline truncate max-w-[180px] sm:max-w-[260px]"
                    title={item.label}
                  >
                    {idx === 0 && <Home className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
