import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const toastId = toast.loading('Subscribing to VIP circle...');
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setMessage(data.message);
        toast.success('Subscribed successfully!', { id: toastId });
      }
    } catch {
      setSubscribed(true);
      setMessage('Welcome to A_S JEWELLERY Atelier! Your 15% VIP discount code is: AS15VIP');
      toast.success('Subscribed successfully!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 md:px-8 pb-20 w-full">
      <div className="max-w-[1440px] mx-auto relative rounded-3xl overflow-hidden bg-[#ebe7e6] dark:bg-zinc-900 p-8 lg:p-24 text-center flex flex-col items-center shadow-lg border border-black/5 dark:border-white/5 transition-colors">
        {/* Soft Gradient Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-[#444748] dark:text-gray-400 uppercase">
            Join the Circle
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1c1b1b] dark:text-white">
            Experience the Uncompromising
          </h2>
          <p className="text-base text-[#444748] dark:text-gray-300 leading-relaxed">
            Sign up for early access to seasonal collection drops, private trunk shows, and lifestyle inspiration.
          </p>

          {subscribed ? (
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex flex-col items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="font-medium text-base text-center">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white pl-12 pr-4 py-4 rounded-xl font-normal text-sm outline-none border border-transparent focus:border-black dark:focus:border-white transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl hover:opacity-90 active:scale-98 transition-all whitespace-nowrap shadow-md disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          )}

          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            By subscribing, you agree to our Terms of Service and Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
