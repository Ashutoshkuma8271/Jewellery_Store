import React, { useState, useEffect } from 'react';
import { Mail, Check, ArrowRight, Send, X, Loader2, Gem } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VerifyEmailViewProps {
  email: string;
  otpId: string;
  onVerified: () => void;
  onResendOTP: () => Promise<{ success: boolean; otpId?: string; otp?: string; message?: string }>;
  onBack: () => void;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({
  email,
  otpId,
  onVerified,
  onResendOTP,
  onBack
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (otpCode.length !== 6) {
      const msg = 'Please enter a valid 6-digit OTP code.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    const toastId = toast.loading('Verifying code...');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpId, otp: otpCode })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg('Email verified successfully! Redirecting to login...');
        toast.success('Email verified successfully!', { id: toastId });
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        const msg = data.message || 'Invalid OTP. Please try again.';
        setErrorMsg(msg);
        toast.error(msg, { id: toastId });
      }
    } catch (err) {
      const msg = 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsResending(true);
    const toastId = toast.loading('Resending OTP...');
    try {
      const result = await onResendOTP();
      if (result.success) {
        setSuccessMsg('New OTP sent to your email. ' + (result.otp ? `Development OTP: ${result.otp}` : ''));
        toast.success('New OTP sent to your email.', { id: toastId });
        setOtpCode('');
      } else {
        const msg = result.message || 'Failed to resend OTP.';
        setErrorMsg(msg);
        toast.error(msg, { id: toastId });
      }
    } catch (err) {
      const msg = 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f8] dark:bg-[#1c1b1b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-black/5 dark:border-white/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] dark:from-[#2a2620] dark:to-[#171717] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-xl mx-auto mb-4 shadow-md">
            <Gem className="w-6 h-6 text-[#c8a96b]" />
          </div>
          <p className="text-[10px] font-serif tracking-[0.2em] text-[#a78345] dark:text-[#c8a96b] uppercase font-bold mb-1">
            A_S JEWELLERY ATELIER
          </p>
          <h1 className="text-3xl font-bold font-serif text-[#1c1b1b] dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent a 6-digit code to <span className="font-medium text-black dark:text-white">{email}</span>
          </p>
        </div>

        {/* Error/Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-medium border border-rose-200 dark:border-rose-900 mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-900 mb-4">
            {successMsg}
          </div>
        )}

        {/* OTP Form */}
        {!successMsg.includes('verified successfully') && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">ENTER OTP CODE</label>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpCode[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const newOtp = otpCode.split('');
                      newOtp[index] = value;
                      setOtpCode(newOtp.join(''));
                      
                      // Auto-focus next input
                      if (value && index < 5) {
                        const targetEl = e.currentTarget as HTMLInputElement;
                        const nextInput = targetEl.parentElement?.children[index + 1] as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                        const targetEl = e.currentTarget as HTMLInputElement;
                        const prevInput = targetEl.parentElement?.children[index - 1] as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-zinc-800/60 border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Resend OTP Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Signup</span>
              </button>
            </div>
          </form>
        )}

        {/* Success State */}
        {successMsg.includes('verified successfully') && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please log in with your credentials to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
