import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import whatsappIcon from '../../assets/whatsapp.png';

interface FloatingWidgetsProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({
  whatsappNumber = '919876543210',
  whatsappMessage = 'Hello A_S JEWELLERY, I would like to inquire about your premium collection.'
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="group relative w-12 h-12 rounded-full bg-[#1c1b1b] dark:bg-white text-white dark:text-[#1c1b1b] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border border-white/10 dark:border-black/10 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          
          {/* Hover Tooltip */}
          <span className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md">
            Back to top
          </span>
        </button>
      )}

      {/* WhatsApp Chat Concierge Button */}
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chat with WhatsApp Concierge"
        title="Chat on WhatsApp"
        className="group relative w-14 h-14 overflow-hidden rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-[0_14px_35px_rgba(37,211,102,.42)] flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white/90"
      >
        {/* Animated Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

        <img src={whatsappIcon} alt="" className="relative z-10 h-full w-full object-cover" />

        {/* Hover Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md">
          Chat with VIP Concierge
        </span>
      </button>
    </div>
  );
};
