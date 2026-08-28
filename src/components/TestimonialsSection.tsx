import React from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import { Review } from '../types';

interface TestimonialsSectionProps {
  reviews: Review[];
  onOpenReviewModal: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviews,
  onOpenReviewModal
}) => {
  return (
    <section className="bg-white dark:bg-zinc-950 py-20 w-full overflow-hidden transition-colors border-t border-black/5 dark:border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#444748] dark:text-gray-400 uppercase">
              Voices of Excellence
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1c1b1b] dark:text-white mt-1">
              Trusted by Visionaries
            </h2>
          </div>

          <button
            onClick={onOpenReviewModal}
            className="px-5 py-2.5 bg-[#f1edec] dark:bg-zinc-800 text-black dark:text-white font-semibold text-xs rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Testimonials Grid / Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-[#f7f3f2] dark:bg-zinc-900 rounded-3xl space-y-4 shadow-sm border border-black/5 dark:border-white/5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-500 fill-amber-500"
                    />
                  ))}
                </div>

                <p className="text-base text-[#1c1b1b] dark:text-gray-200 italic font-serif leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover shadow-sm"
                />
                <div>
                  <p className="font-semibold text-sm text-[#1c1b1b] dark:text-white">
                    {rev.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
