import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: { name: string; role: string; text: string; rating: number }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onAddReview
}) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, text, rating })
      });
      const data = await res.json();
      if (data.success) {
        onAddReview(data.review);
        setSubmitted(true);
      }
    } catch {
      onAddReview({
        name,
        role: role || 'Verified Buyer',
        text,
        rating
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md"></div>

      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-8 shadow-2xl z-10 text-[#1c1b1b] dark:text-white border border-black/5 dark:border-white/10 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold">Review Submitted</h3>
            <p className="text-xs text-gray-500">
              Thank you for sharing your experience with the A_S JEWELLERY community!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Customer Testimonial
              </span>
              <h3 className="text-xl font-semibold">Write Your Experience</h3>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Voss"
                className="w-full mt-1 bg-[#f7f3f2] dark:bg-zinc-800 px-4 py-3 rounded-xl text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Profession / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Architect, Verified Patron"
                className="w-full mt-1 bg-[#f7f3f2] dark:bg-zinc-800 px-4 py-3 rounded-xl text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Your Words</label>
              <textarea
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share details on craftsmanship, aesthetics, and delivery speed..."
                className="w-full mt-1 bg-[#f7f3f2] dark:bg-zinc-800 px-4 py-3 rounded-xl text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
