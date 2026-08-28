import React from 'react';
import {
  Headphones,
  Shirt,
  Armchair,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Category } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface CuratedCategoriesProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Headphones: <Headphones className="w-7 h-7" />,
  Shirt: <Shirt className="w-7 h-7" />,
  Armchair: <Armchair className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
  Dumbbell: <Dumbbell className="w-7 h-7" />,
  BookOpen: <BookOpen className="w-7 h-7" />,
  Gamepad2: <Gamepad2 className="w-7 h-7" />,
  ShoppingBag: <ShoppingBag className="w-7 h-7" />
};

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <section id="categories-section" className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#444748] dark:text-gray-400 uppercase">
            Shop by
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1c1b1b] dark:text-white mt-1">
            Curated Categories
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-sm font-semibold text-black dark:text-white flex items-center gap-1.5 group hover:underline"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => {
          const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`group relative aspect-square overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 shadow-sm hover:shadow-2xl ${
                isSelected ? 'ring-2 ring-black dark:ring-white scale-[1.02]' : ''
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                <div className="text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                  {ICON_MAP[cat.iconName] || <ShoppingBag className="w-7 h-7" />}
                </div>
                <h3 className="font-medium text-xl text-white tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  {cat.itemCount} Items
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
