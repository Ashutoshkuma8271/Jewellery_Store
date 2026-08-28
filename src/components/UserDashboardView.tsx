import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  Shield,
  MapPin,
  Bell,
  Check,
  Package,
  ChevronRight,
  Key,
  Smartphone,
  Lock,
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  LogOut,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  Send,
  ShieldCheck,
  KeyRound,
  Settings,
  Wallet,
  CreditCard,
  Tag,
  Ticket,
  Copy,
  Gift,
  Truck,
  CheckCircle2,
  FileText,
  RefreshCw,
  X,
  Gem,
  Crown
} from 'lucide-react';
import { Product } from '../types';
import { handleImageError } from '../utils/imageFallback';
import { apiFetch } from '../utils/apiFetch';
import { toast } from 'react-hot-toast';
import { OrderHistoryView } from './OrderHistoryView';
import { AddressBookView } from './AddressBookView';
import { AdminDashboard } from './AdminDashboard';

interface UserDashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  wishlistCount: number;
  user: {
    name: string;
    email: string;
    avatar: string;
    memberTier: string;
    phone: string;
    role?: string;
  } | null;
  initialTab?: string;
  authToken?: string;
  onLogout?: () => void;
  onAuthSuccess?: (userData: any, token: string) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onNavigate,
  onSelectProduct,
  wishlistCount,
  user,
  initialTab,
  authToken,
  onLogout,
  onAuthSuccess
}) => {
  // If not logged in, render Unauthenticated State
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Authenticated State
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address' | 'wallet' | 'coupons' | 'communications' | 'admin'>((initialTab as any) || (user?.role === 'admin' ? 'admin' : 'profile'));
  const [fullName, setFullName] = useState(user?.name || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [birthday, setBirthday] = useState('11/24/1992');
  const [gender, setGender] = useState('Male');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Wallet & Coupons State
  const [walletBalance] = useState(12500);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [giftCardInput, setGiftCardInput] = useState('');

  // Notifications preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [smsTracking, setSmsTracking] = useState(true);

  // Saved Cards & UPIs
  const [savedCards, setSavedCards] = useState([
    { id: '1', bank: 'HDFC Bank VIP Metal', number: '•••• •••• •••• 4920', expiry: '08/28', type: 'VISA Infinite' },
    { id: '2', bank: 'ICICI Emeralde', number: '•••• •••• •••• 8812', expiry: '11/29', type: 'Mastercard World' }
  ]);

  const couponsList = [
    { code: 'AS15VIP', discount: '15% OFF', title: 'A_S JEWELLERY VIP Patron Discount', desc: 'Valid on all orders above ₹30,000.', expiry: 'Dec 31, 2026' },
    { code: 'WELCOME10', discount: '10% OFF', title: 'Welcome Member Privilege', desc: 'Valid on your first purchase.', expiry: 'Nov 30, 2026' },
    { code: 'VIPFREESHIP', discount: 'FREE SHIPPING', title: 'Complimentary Express Air Cargo', desc: 'No minimum order value.', expiry: 'Ongoing' }
  ];

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmailAddress(user.email);
      setPhoneNumber(user.phone || '+91 98765 43210');
      setAvatarUrl(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      if (user.role === 'admin') {
        setActiveTab('admin');
      }
    }
  }, [user]);

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardInput) return;
    showToast(`Gift Voucher "${giftCardInput.toUpperCase()}" applied successfully! ₹2,500 credited to A_S JEWELLERY Wallet.`);
    setGiftCardInput('');
  };

  const dispatchLogin = (userData: any, token: string) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData, token);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const emailPrompt = prompt('Enter Google Email Address to Sign In / Sign Up:', 'ashutoshkumaryadav933499@gmail.com');
      if (!emailPrompt) {
        setIsLoading(false);
        return;
      }
      const email = emailPrompt.trim();
      const name = email.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
      
      const res = await apiFetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' })
      });
      const data = await res.json();

      if (data.success) {
        dispatchLogin({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY VIP Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
      } else {
        setAuthError(data.message || 'Google Auth failed.');
      }
    } catch {
      setAuthError('Network error during Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!authToken) {
      toast.success('Profile updated successfully!');
      return;
    }
    const toastId = toast.loading('Updating profile...');
    try {
      const res = await apiFetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: fullName,
          phone: phoneNumber,
          birthday,
          gender
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onAuthSuccess && user) {
          onAuthSuccess({
            ...user,
            name: fullName,
            phone: phoneNumber
          }, authToken);
        }
        toast.success('Profile updated successfully!', { id: toastId });
      } else {
        toast.error(data.message || 'Failed to update profile.', { id: toastId });
      }
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!signInEmail || !signInPassword) {
      setAuthError('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });
      const data = await res.json();
      if (data.success) {
        dispatchLogin({
          name: data.user.name,
          email: data.user.email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY Gold Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
      } else {
        setAuthError(data.message || 'Login failed. Please check credentials.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setAuthError('Please complete all required fields.');
      return;
    }
    if (signUpPassword.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setAuthError('You must accept the terms to create an account.');
      return;
    }

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
        dispatchLogin({
          name: data.user.name,
          email: data.user.email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberTier: data.user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY VIP Patron',
          phone: '+91 98765 43210',
          role: data.user.role,
          cart: data.user.cart,
          wishlist: data.user.wishlist
        }, data.token);
      } else {
        setAuthError(data.message || 'Signup failed. Please try again.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER UNAUTHENTICATED STATE
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf8f8] dark:bg-[#1c1b1b] text-[#1c1b1b] dark:text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] dark:from-[#2a2620] dark:to-[#171717] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-xl mx-auto shadow-md">
              <Gem className="w-6 h-6 text-[#c8a96b]" />
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-black dark:text-white uppercase">
              A_S <span className="text-[#a78345] dark:text-[#c8a96b] font-light">JEWELLERY</span> Concierge
            </h2>
            <p className="text-xs text-gray-500">
              Sign in or create an account to manage your orders, saved addresses, and VIP concierge benefits.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {authMode !== 'forgot' && (
              <div className="flex bg-gray-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-md font-extrabold'
                      : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-md font-extrabold'
                      : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Register Account
                </button>
              </div>
            )}

            {authError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="alex.sterling@luxe.studio"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">PASSWORD</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] font-bold text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLoading ? 'SIGNING IN...' : 'ACCESS MEMBER PORTAL'}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-gray-400"><span className="bg-white dark:bg-zinc-900 px-3">OR AUTHENTICATE WITH</span></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 border border-gray-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alexander Sterling"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="alex.sterling@luxe.studio"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">CREATE PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="termsCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-black rounded cursor-pointer"
                  />
                  <label htmlFor="termsCheck" className="text-[11px] text-gray-500 cursor-pointer">
                    I accept the A_S JEWELLERY VIP Terms & Privacy Policy
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'CREATE A_S JEWELLERY ACCOUNT'}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD */}
            {authMode === 'forgot' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-serif font-bold text-black dark:text-white">Reset Password</h3>
                  <p className="text-xs text-gray-500">Enter your email address to receive reset instructions.</p>
                </div>

                {forgotSubmitted ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-2xl text-center space-y-2">
                    <Check className="w-8 h-8 mx-auto text-emerald-600" />
                    <p className="text-xs font-bold">Reset Instructions Dispatched</p>
                    <p className="text-[11px] text-gray-500">Check your inbox to finalize your new password.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotSubmitted(true); }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="alex.sterling@luxe.studio"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90"
                    >
                      SEND RESET LINK
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="w-full text-center text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white pt-2 cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER AUTHENTICATED USER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fdf8f8] dark:bg-[#1c1b1b] text-[#1c1b1b] dark:text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

      {/* Hero Banner Header */}
      <div className="relative bg-gradient-to-r from-zinc-900 via-stone-900 to-black rounded-3xl p-6 sm:p-10 border border-black/10 dark:border-white/10 shadow-2xl text-white overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={fullName}
                onError={handleImageError}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-amber-500/60 shadow-xl"
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-amber-500 text-black rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Update Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">{fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-500/30">
                  {user.memberTier || (user.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY Premier Member')}
                </span>
              </div>

              <p className="text-xs text-gray-300 font-mono">{emailAddress}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  {phoneNumber}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified VIP Patron
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Essential E-Commerce Privileges) */}
      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4 overflow-x-auto">
        {[
          { id: 'profile', label: 'My Profile', icon: UserIcon },
          { id: 'orders', label: 'Orders & Tracking', icon: Package },
          { id: 'address', label: 'Saved Addresses', icon: MapPin },
          { id: 'wallet', label: 'A_S JEWELLERY Wallet & Payments', icon: Wallet },
          { id: 'coupons', label: 'Coupons & Vouchers', icon: Ticket }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-102 font-extrabold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-serif font-bold text-black dark:text-white pb-3 border-b border-black/5 dark:border-white/5">
              Personal Information & Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Date of Birth</label>
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-medium outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Gender Identity</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl py-3 px-4 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-2xl hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                Save Profile Details
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-amber-900 dark:text-amber-300">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-sm">VIP Member Status</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Enjoy priority doorstep shipping, 24/7 dedicated concierge assistance, and private invitations to exclusive product releases.
              </p>
              <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-2xl flex items-center justify-between text-xs font-bold">
                <span>Wishlist Saved Items</span>
                <span className="text-amber-600 font-mono text-sm">{wishlistCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <OrderHistoryView onNavigate={onNavigate} />
      )}

      {/* TAB CONTENT: ADDRESS */}
      {activeTab === 'address' && (
        <AddressBookView currentUser={user} />
      )}

      {/* TAB CONTENT: LUXE WALLET & PAYMENTS */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-black dark:text-white">A_S JEWELLERY Store Credits & Wallet</h3>
                  <p className="text-xs text-gray-500">Instant checkout balance & cashback rewards</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available Balance</p>
                <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">₹{walletBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Saved Payment Instruments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Saved Cards & Payment Methods</h4>
                <button
                  onClick={() => showToast('Card manager modal initialized.')}
                  className="text-xs font-bold text-black dark:text-white hover:underline cursor-pointer"
                >
                  + Add New Card
                </button>
              </div>

              <div className="space-y-3">
                {savedCards.map(card => (
                  <div key={card.id} className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-bold text-black dark:text-white">{card.bank}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{card.number} • Exp {card.expiry}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full font-bold text-[10px]">
                      {card.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Gift Card */}
            <div className="p-5 bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-2xl border border-amber-500/20 space-y-3">
              <h4 className="text-xs font-bold text-black dark:text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600" />
                Claim Gift Voucher / Store Credit
              </h4>
              <form onSubmit={handleApplyGiftCard} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 16-digit voucher code..."
                  value={giftCardInput}
                  onChange={(e) => setGiftCardInput(e.target.value)}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 cursor-pointer"
                >
                  Claim
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COUPONS & VOUCHERS */}
      {activeTab === 'coupons' && (
        <div className="max-w-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-black dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                Exclusive VIP Coupons & Discount Privileges
              </h3>
              <p className="text-xs text-gray-500 mt-1">Apply these codes at checkout for instant order discounts</p>
            </div>
          </div>

          <div className="space-y-4">
            {couponsList.map((coupon, idx) => (
              <div key={idx} className="p-5 bg-gray-50 dark:bg-zinc-800/60 border border-black/5 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-mono font-extrabold text-xs rounded-xl tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{coupon.discount}</span>
                  </div>
                  <p className="font-bold text-xs text-black dark:text-white pt-1">{coupon.title}</p>
                  <p className="text-[11px] text-gray-500">{coupon.desc} • Valid until {coupon.expiry}</p>
                </div>

                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === coupon.code ? 'COPIED!' : 'COPY CODE'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COMMUNICATIONS */}
      {activeTab === 'communications' && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-lg font-serif font-bold text-black dark:text-white pb-3 border-b border-black/5 dark:border-white/5">
            Concierge & Tracking Preferences
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <div>
                <p className="text-black dark:text-white font-bold">Email Collection Previews</p>
                <p className="text-[11px] text-gray-500">Receive private preview links for seasonal catalog drops</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <div>
                <p className="text-black dark:text-white font-bold">WhatsApp Live Order Tracking</p>
                <p className="text-[11px] text-gray-500">Real-time delivery status updates via WhatsApp messages</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <div>
                <p className="text-black dark:text-white font-bold">SMS Express Shipping Alerts</p>
                <p className="text-[11px] text-gray-500">Doorstep delivery OTP and courier status via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={smsTracking}
                onChange={(e) => setSmsTracking(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADMIN */}
      {activeTab === 'admin' && user.role === 'admin' && (
        <AdminDashboard token={authToken || 'demo-admin-token'} onLogout={onLogout} />
      )}
    </div>
  );
};
