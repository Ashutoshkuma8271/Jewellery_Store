import React, { useState } from 'react';
import { Share2, Globe, MessageSquare, Send, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ContactView: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPolicy) {
      toast.error('Please accept the privacy policy to submit your message.');
      return;
    }
    setIsSent(true);
    toast.success('Message sent successfully!');
    setTimeout(() => {
      setIsSent(false);
      setFullName('');
      setEmailAddress('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 w-full space-y-16">
      
      {/* SECTION 1: HEADER & FORM */}
      <div className="space-y-10">
        
        {/* Title */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
            CONNECT WITH US
          </p>
          <h1 className="text-4xl sm:text-6xl font-light font-serif tracking-tight text-[#1c1b1b] dark:text-white leading-[1.1]">
            We bring <span className="italic font-normal">vision</span> to light. <br />
            Let's start a conversation.
          </h1>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inquiries Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#f8f5f4] dark:bg-zinc-900/90 rounded-3xl p-8 sm:p-10 space-y-8 border border-black/5 dark:border-white/5 shadow-xs">
            
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">INQUIRIES</p>
              <a href="mailto:concierge@asjewellery.com" className="text-2xl font-semibold font-mono text-black dark:text-white hover:underline block">
                concierge@asjewellery.com
              </a>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">CONCIERGE DESK</p>
              <p className="text-xl font-medium font-mono text-black dark:text-white">
                +91 93349 90000
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-black/10 dark:border-white/10">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">FLAGSHIP ATELIER SHOWROOM</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                A_S JEWELLERY Atelier<br />
                Diamond Heritage District, Bandra West<br />
                Mumbai, MH 400050, India
              </p>
              <a href="#map" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline pt-1">
                <span>View on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center gap-4 text-gray-500">
              <button className="p-3 bg-white dark:bg-zinc-800 rounded-full hover:text-black dark:hover:text-white transition-colors shadow-xs">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-3 bg-white dark:bg-zinc-800 rounded-full hover:text-black dark:hover:text-white transition-colors shadow-xs">
                <Globe className="w-4 h-4" />
              </button>
              <button className="p-3 bg-white dark:bg-zinc-800 rounded-full hover:text-black dark:hover:text-white transition-colors shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 rounded-3xl p-8 sm:p-10 border border-black/5 dark:border-white/10 shadow-xs">
            
            {isSent ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-black dark:text-white">Message Transmitted</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Thank you for reaching out to A_S JEWELLERY Client Concierge. A dedicated specialist will respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alexander Voss"
                      className="w-full border-b border-gray-300 dark:border-zinc-700 py-3 bg-transparent text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="patron@asjewellery.com"
                      className="w-full border-b border-gray-300 dark:border-zinc-700 py-3 bg-transparent text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">SELECT SUBJECT</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border-b border-gray-300 dark:border-zinc-700 py-3 bg-transparent text-sm text-black dark:text-white outline-none font-medium cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bespoke Interior Styling">Bespoke Interior Styling</option>
                    <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="VIP Private Client">VIP Private Client Desk</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">YOUR MESSAGE</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project or inquiry..."
                    className="w-full border-b border-gray-300 dark:border-zinc-700 py-3 bg-transparent text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white font-medium resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={agreedPolicy}
                      onChange={(e) => setAgreedPolicy(e.target.checked)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span>I agree to the <a href="#privacy" className="underline text-black dark:text-white">Privacy Policy</a></span>
                  </label>

                  <button
                    type="submit"
                    disabled={!agreedPolicy}
                    className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-all flex items-center gap-2.5 shadow-md disabled:opacity-40"
                  >
                    <span>SEND MESSAGE</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>

      {/* SECTION 2: MAP BANNER ("Visit Us") */}
      <div id="map" className="relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-gray-200 dark:bg-zinc-800 aspect-[21/9] sm:aspect-[24/8] min-h-[280px]">
        {/* Map Image Graphic */}
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
          alt="Showroom Location Map"
          className="w-full h-full object-cover grayscale contrast-125 opacity-80"
        />

        {/* Map Floating Information Card */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 max-w-sm bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-black dark:text-white">Visit Us</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Our flagship space is open Monday through Friday, 10am to 6pm. Appointments recommended.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-amber-800 dark:text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>BY APPOINTMENT ONLY</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: ATELIER GLIMPSES GALLERY */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              FOLLOW OUR JOURNEY
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black dark:text-white mt-0.5">
              Atelier Glimpses
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold tracking-widest text-black dark:text-white hover:underline uppercase"
          >
            @AS_JEWELLERY_ATELIER
          </a>
        </div>

        {/* 4-Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group cursor-pointer shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
              alt="Architectural Facade"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group cursor-pointer shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
              alt="Lounge Space"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group cursor-pointer shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80"
              alt="Design Swatches"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group cursor-pointer shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
              alt="Prism Light"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
