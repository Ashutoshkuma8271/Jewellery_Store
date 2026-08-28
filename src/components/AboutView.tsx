import React from 'react';
import { motion } from 'motion/react';
import { Shield, Compass, Leaf, ArrowRight, Sparkles } from 'lucide-react';

interface AboutViewProps {
  onExploreCollection: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreCollection }) => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 w-full space-y-20">
      
      {/* SECTION 1: HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Copy (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
            SINCE 2012
          </span>

          <h1 className="text-4xl sm:text-6xl font-light font-serif tracking-tight text-[#1c1b1b] dark:text-white leading-[1.1]">
            The Art of <br />
            <span className="italic font-normal">Refined</span> Living.
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-lg">
            A_S JEWELLERY was born from a singular obsession: to celebrate timeless heritage with modern elegance and fine jewelry craftsmanship. We don't just curate ornaments; we craft certified heirloom memories that endure.
          </p>

          <div className="pt-2">
            <button
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-1 hover:opacity-70 transition-opacity"
            >
              <span>Our Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image with Quote Overlay (7 Cols) */}
        <div className="lg:col-span-7 relative">
          <div className="aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-gray-100 dark:bg-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
              alt="Refined Living Space"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Quote Card */}
          <div className="absolute -bottom-6 left-6 sm:left-10 max-w-sm bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl">
            <p className="text-xs sm:text-sm font-serif italic text-black dark:text-white leading-relaxed">
              "Design is not just what it looks like and feels like. Design is how it works."
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 2: OUR ETHOS */}
      <div className="space-y-10 pt-8 border-t border-black/5 dark:border-white/5">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1c1b1b] dark:text-white">
              Our Ethos
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mt-2">
              We operate at the intersection of traditional craftsmanship and avant-garde technology.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase">
            01 — 03 PHILOSOPHY
          </span>
        </div>

        {/* Ethos Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-xs space-y-6"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-black dark:text-white">Uncompromising Quality</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Every material is sourced from heritage mills and sustainable forests, ensuring a lifetime of use.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-xs space-y-6"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-black dark:text-white">Swiss Precision</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Our engineering process respects the millimeter. Form follows function with mathematical rigor.
              </p>
            </div>
          </motion.div>

          {/* Card 3 (Dark Accent) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-black text-white rounded-3xl border border-black shadow-xl space-y-6"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-white">Radical Responsibility</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Circular design isn't a feature; it's our foundation. We believe in owning less, but owning better.
              </p>
            </div>
          </motion.div>

        </div>

      </div>

      {/* SECTION 3: THE VISIONARIES */}
      <div className="space-y-10 pt-8 border-t border-black/5 dark:border-white/5">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#1c1b1b] dark:text-white">
            The Visionaries.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Visionary 1 */}
          <div className="space-y-4 group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Elena Voss"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-black dark:text-white">Elena Voss</h3>
              <p className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                CHIEF CREATIVE OFFICER
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                Formerly at the helm of Bauhaus-Modern, Elena brings a decade of architectural design experience to our product development.
              </p>
            </div>
          </div>

          {/* Visionary 2 */}
          <div className="space-y-4 group md:translate-y-6">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Marcus Thorne"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-black dark:text-white">Marcus Thorne</h3>
              <p className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                FOUNDING PARTNER
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                Marcus founded A_S JEWELLERY with the belief that luxury fine jewelry should be defined by authentic craftsmanship, purity, and certified diamonds rather than fleeting trends.
              </p>
            </div>
          </div>

          {/* Visionary 3 */}
          <div className="space-y-4 group md:translate-y-12">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
                alt="Sasha Laine"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-black dark:text-white">Sasha Laine</h3>
              <p className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                HEAD OF SUSTAINABILITY
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                Directing our journey toward carbon neutrality, Sasha ensures every supply chain link meets our rigorous ethical standards.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4: JOIN THE MOVEMENT CTA BANNER */}
      <div className="p-10 sm:p-16 bg-black text-white rounded-3xl text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
            Join the Movement.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Experience timeless luxury engineered with precision and built for a lifetime.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            onClick={onExploreCollection}
            className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-amber-400 transition-colors shadow-lg"
          >
            EXPLORE THE COLLECTION
          </button>

          <button
            onClick={onExploreCollection}
            className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
          >
            VIEW MANIFESTO
          </button>
        </div>
      </div>

    </div>
  );
};
