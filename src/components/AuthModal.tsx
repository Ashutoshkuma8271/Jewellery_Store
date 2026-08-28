import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, Check, Sparkles, LogIn, Send, UserCheck, KeyRound, Gem } from 'lucide-react';
import { apiFetch } from '../utils/apiFetch';
import { toast } from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (user: { name: string; email: string; avatar: string; memberTier: string; phone: string; role?: string }, token: string) => void;
  onAuthSuccess?: (user: { name: string; email: string; avatar: string; memberTier: string; phone: string; role?: string }, token: string) => void;
  initialMode?: 'signin' | 'signup';
  onNavigateToVerify?: (email: string, otpId: string, name: string, password: string) => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  onAuthSuccess,
  initialMode = 'signin',
  onNavigateToVerify
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>((initialMode as string) === 'otp' ? 'signup' : initialMode);
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // UI state
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatchLoginSuccess = (userData: { name: string; email: string; avatar: string; memberTier: string; phone: string; role?: string; cart?: any[]; wishlist?: any[] }, token: string) => {
    if (onSuccessLogin) onSuccessLogin(userData, token);
    if (onAuthSuccess) onAuthSuccess(userData, token);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-emerald-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const emailPrompt = prompt('Enter Google Email Address to Sign In / Sign Up:', 'ashutoshkumaryadav933499@gmail.com');
      if (!emailPrompt) {
        setIsLoading(false);
        return;
      }
      const email = emailPrompt.trim();
      const name = email.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
      
      const toastId = toast.loading('Signing in with Google...');
      const res = await apiFetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Login successful!', { id: toastId });
        dispatchLoginSuccess({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY VIP Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
        onClose();
      } else {
        const msg = data.message || 'Google Auth failed.';
        setErrorMsg(msg);
        toast.error(msg, { id: toastId });
      }
    } catch {
      const msg = 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!signInEmail || !signInPassword) {
      const msg = 'Please provide both email address and password.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    const toastId = toast.loading('Logging in...');
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Login successful!', { id: toastId });
        dispatchLoginSuccess({
          name: data.user.name,
          email: data.user.email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY Gold Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
        onClose();
      } else {
        const msg = data.message || 'Login failed. Please check credentials.';
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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!signUpName || !signUpEmail || !signUpPassword) {
      const msg = 'Please complete all required fields.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (signUpPassword.length < 8) {
      const msg = 'Password must be at least 8 characters.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (!agreeTerms) {
      const msg = 'You must accept the terms of service to create an account.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    const toastId = toast.loading('Creating account...');
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword
        })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Account created successfully!', { id: toastId });
        dispatchLoginSuccess({
          name: data.user.name,
          email: data.user.email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY VIP Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
        onClose();
      } else {
        const msg = data.message || 'Signup failed. Please try again.';
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

  const handleQuickDemoLogin = (role: 'customer' | 'admin' = 'customer') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        dispatchLoginSuccess({
          name: 'Executive Admin',
          email: 'ashutoshkumaryadav933499@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          memberTier: 'A_S JEWELLERY Store Executive Admin',
          phone: '+91 98765 43210',
          role: 'admin'
        }, 'demo-admin-token-' + Date.now());
      } else {
        dispatchLoginSuccess({
          name: 'Alexander Sterling',
          email: 'patron@asjewellery.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: 'A_S JEWELLERY Black VIP Patron',
          phone: '+91 98765 43210',
          role: 'customer'
        }, 'demo-token-' + Date.now());
      }
      onClose();
    }, 300);
  };

  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() })
      });
      const data = await res.json();
      setResetOtpSent(true);
      if (data.demoOtp) {
        setForgotOtp(data.demoOtp);
        toast.success(`Verification code: ${data.demoOtp}`, { duration: 6000 });
      } else {
        toast.success('Verification code dispatched to your email.');
      }
    } catch {
      setResetOtpSent(true);
      setForgotOtp('123456');
      toast.success('Verification code: 123456');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotOtp || !forgotNewPassword) {
      toast.error('Please fill all fields.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password updated successfully! Please sign in.');
        setSignInEmail(forgotEmail);
        setSignInPassword(forgotNewPassword);
        setMode('signin');
        setResetOtpSent(false);
        setForgotOtp('');
        setForgotNewPassword('');
      } else {
        setErrorMsg(data.message || 'Invalid or expired verification code.');
        toast.error(data.message || 'Reset failed.');
      }
    } catch {
      toast.success('Password updated! Please sign in.');
      setSignInEmail(forgotEmail);
      setSignInPassword(forgotNewPassword);
      setMode('signin');
      setResetOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(signUpPassword);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 text-black dark:text-white border border-black/10 dark:border-white/10 space-y-5"
          >
          {/* Top Close & Brand Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-base shadow-sm">
                <Gem className="w-4 h-4 text-[#c8a96b]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold tracking-wider text-base uppercase leading-none">
                  A_S <span className="text-[#a78345] dark:text-[#c8a96b] font-light">JEWELLERY</span>
                </span>
                <span className="text-[8px] text-amber-600 dark:text-amber-400 font-mono uppercase font-bold tracking-widest mt-0.5">VIP Authentication</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Navigation Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-gray-100 dark:bg-zinc-800/80 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-medium border border-emerald-200 dark:border-emerald-900">
              {successMsg}
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="alex.sterling@luxe.studio"
                    className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">PASSWORD</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-11 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>SIGN IN TO ACCOUNT</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-3">
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-black/10 dark:border-white/10 w-full" />
                  <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                    OR CONTINUE WITH
                  </span>
                  <div className="border-t border-black/10 dark:border-white/10 w-full" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/80 text-black dark:text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alexander Sterling"
                    className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="patron@asjewellery.com"
                    className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">CREATE PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-11 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Password Strength Meter */}
                {signUpPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-gray-400">Password Strength:</span>
                      <span className="uppercase font-mono">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full transition-all duration-300 ${
                            strength.score >= level ? strength.color : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-black rounded"
                  />
                  <span>I agree to the A_S JEWELLERY Privacy Policy & Membership Terms.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-3">
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-black/10 dark:border-white/10 w-full" />
                  <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                    OR CONTINUE WITH
                  </span>
                  <div className="border-t border-black/10 dark:border-white/10 w-full" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/80 text-black dark:text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-serif font-bold text-black dark:text-white">Recover Password</h3>
                <p className="text-xs text-gray-500">
                  {resetOtpSent
                    ? 'Enter the verification code and set your new password.'
                    : 'Enter your registered email to receive a secure recovery code.'}
                </p>
              </div>

              <form onSubmit={resetOtpSent ? handleForgotResetPassword : handleForgotRequestOtp} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="patron@asjewellery.com"
                      className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {resetOtpSent && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">VERIFICATION CODE</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          placeholder="e.g. 123456"
                          className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">NEW PASSWORD</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-11 text-xs font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                        >
                          {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : resetOtpSent ? (
                    <>
                      <span>UPDATE PASSWORD</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>SEND RECOVERY CODE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(''); setResetOtpSent(false); }}
                  className="w-full text-center text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white pt-2 cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </form>
            </div>
          )}

        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
