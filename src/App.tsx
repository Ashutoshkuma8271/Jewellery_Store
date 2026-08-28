import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { GwellaryHome } from './components/GwellaryHome';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ReviewModal } from './components/ReviewModal';
import { AccountModal } from './components/AccountModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { FloatingWidgets } from './components/FloatingWidgets';

// Dedicated Full-Screen View Components
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboardView } from './components/UserDashboardView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { CheckoutView } from './components/CheckoutView';
import { ShopCollectionView } from './components/ShopCollectionView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AddressBookView } from './components/AddressBookView';

import { PRODUCTS, CATEGORIES, REVIEWS } from './data/jewelryData';
import { Product, CartItem, Review } from './types';
import { apiFetch } from './utils/apiFetch';

// Cookie Helper Utilities for Persistent Session Management across page refreshes
function setCookie(name: string, value: string, days: number = 30) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    memberTier: string;
    phone: string;
    role?: string;
  } | null>(null);

  // Current Screen Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'dashboard' | 'orders' | 'product' | 'checkout' | 'about' | 'contact' | 'addresses'>('home');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Restore Persistent Session from Cookies, LocalStorage, & SessionStorage on Page Load
  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem('luxe_auth_token') ||
        sessionStorage.getItem('luxe_auth_token') ||
        getCookie('luxe_auth_token');

      const storedUserStr =
        localStorage.getItem('luxe_current_user') ||
        sessionStorage.getItem('luxe_current_user');

      const storedView =
        localStorage.getItem('luxe_current_view') ||
        sessionStorage.getItem('luxe_current_view');

      if (storedView) {
        setCurrentView(storedView as any);
      } else if (storedToken && storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        if (parsedUser && parsedUser.role === 'admin') {
          setCurrentView('dashboard');
        }
      }

      if (storedToken && storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        if (parsedUser && parsedUser.email) {
          setIsAuthenticated(true);
          setAuthToken(storedToken);
          setCurrentUser(parsedUser);

          // Restore Isolated User Cart & Wishlist from Local Storage
          const userCartKey = `luxe_cart_${parsedUser.email}`;
          const userWishlistKey = `luxe_wishlist_${parsedUser.email}`;
          
          const savedCart = localStorage.getItem(userCartKey) || sessionStorage.getItem(userCartKey);
          const savedWishlist = localStorage.getItem(userWishlistKey) || sessionStorage.getItem(userWishlistKey);

          if (savedCart) {
            try { setCartItems(JSON.parse(savedCart)); } catch {}
          }
          if (savedWishlist) {
            try { setWishlistIds(JSON.parse(savedWishlist)); } catch {}
          }

          // Sync tokens across all storage layers
          setCookie('luxe_auth_token', storedToken);
          localStorage.setItem('luxe_auth_token', storedToken);
          sessionStorage.setItem('luxe_auth_token', storedToken);
          localStorage.setItem('luxe_current_user', JSON.stringify(parsedUser));
          sessionStorage.setItem('luxe_current_user', JSON.stringify(parsedUser));
        }
      } else {
        // Guest user isolated storage
        const savedCart = localStorage.getItem('luxe_cart_guest');
        const savedWishlist = localStorage.getItem('luxe_wishlist_guest');
        if (savedCart) { try { setCartItems(JSON.parse(savedCart)); } catch {} }
        if (savedWishlist) { try { setWishlistIds(JSON.parse(savedWishlist)); } catch {} }
      }
    } catch {
      // Ignore parse errors on load
    }
  }, []);

  // ALWAYS PERSIST ACTIVE SCREEN VIEW TO PREVENT REDIRECTING TO HOME ON REFRESH (F5)
  useEffect(() => {
    if (currentView) {
      localStorage.setItem('luxe_current_view', currentView);
      sessionStorage.setItem('luxe_current_view', currentView);
    }
  }, [currentView]);

  const handleNavigateView = (view: 'home' | 'shop' | 'dashboard' | 'orders' | 'product' | 'checkout' | 'about' | 'contact' | 'addresses') => {
    setCurrentView(view);
    localStorage.setItem('luxe_current_view', view);
    sessionStorage.setItem('luxe_current_view', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (
    userData: { name: string; email: string; avatar?: string; memberTier?: string; phone?: string; role?: string; cart?: any[]; wishlist?: any[] },
    token: string
  ) => {
    const userObj = {
      name: userData.name || 'Valued Member',
      email: userData.email,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      memberTier: userData.memberTier || (userData.role === 'admin' ? 'A_S JEWELLERY Store Admin' : 'A_S JEWELLERY Premier Member'),
      phone: userData.phone || '',
      role: userData.role
    };

    setIsAuthenticated(true);
    setAuthToken(token);
    setCurrentUser(userObj);

    if (Array.isArray(userData.cart)) {
      setCartItems(userData.cart);
    }
    if (Array.isArray(userData.wishlist)) {
      setWishlistIds(userData.wishlist);
    }
    setIsAuthModalOpen(false);
    setIsAdminAuthModalOpen(false);

    // Save Session to Cookies, LocalStorage, and SessionStorage
    setCookie('luxe_auth_token', token);
    localStorage.setItem('luxe_auth_token', token);
    sessionStorage.setItem('luxe_auth_token', token);

    localStorage.setItem('luxe_current_user', JSON.stringify(userObj));
    sessionStorage.setItem('luxe_current_user', JSON.stringify(userObj));

    // Redirect based on user role and persist view
    if (userData.role === 'admin') {
      setCurrentView('dashboard');
      localStorage.setItem('luxe_current_view', 'dashboard');
      sessionStorage.setItem('luxe_current_view', 'dashboard');
      toast.success(`Welcome Admin, ${userData.name || 'Master Admin'}!`);
    } else {
      setCurrentView('home');
      localStorage.setItem('luxe_current_view', 'home');
      sessionStorage.setItem('luxe_current_view', 'home');
      toast.success("Login successful!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setCurrentUser(null);
    setCartItems([]);
    setWishlistIds([]);

    // Clear all storage mechanisms (Cookies, LocalStorage, SessionStorage)
    eraseCookie('luxe_auth_token');
    localStorage.removeItem('luxe_auth_token');
    sessionStorage.removeItem('luxe_auth_token');
    localStorage.removeItem('luxe_current_user');
    sessionStorage.removeItem('luxe_current_user');
    localStorage.removeItem('luxe_current_view');
    sessionStorage.removeItem('luxe_current_view');

    toast.success('Logged out successfully!');
    setCurrentView('home');
  };

  // Sync Cart to LocalStorage & DB (Isolated User Key)
  useEffect(() => {
    const key = currentUser?.email ? `luxe_cart_${currentUser.email}` : 'luxe_cart_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
    sessionStorage.setItem(key, JSON.stringify(cartItems));

    if (isAuthenticated && authToken) {
      apiFetch('/api/user/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ cart: cartItems })
      }).catch(() => {});
    }
  }, [cartItems, isAuthenticated, authToken, currentUser]);

  // Sync Wishlist to LocalStorage & DB (Isolated User Key)
  useEffect(() => {
    const key = currentUser?.email ? `luxe_wishlist_${currentUser.email}` : 'luxe_wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlistIds));
    sessionStorage.setItem(key, JSON.stringify(wishlistIds));

    if (isAuthenticated && authToken) {
      apiFetch('/api/user/wishlist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ wishlist: wishlistIds })
      }).catch(() => {});
    }
  }, [wishlistIds, isAuthenticated, authToken, currentUser]);

  // Sync dark mode class with HTML and Body elements
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#141414';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#fdf8f8';
      document.body.style.color = '#1c1b1b';
    }
  }, [darkMode]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Fetch initial data from server API if available
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const res = await apiFetch('/api/products');
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // Fallback to imported mock data
      }
    };
    fetchApiData();
  }, []);

  // Listen for direct URL product query param (?product=id)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId && products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setSelectedProduct(found);
        setCurrentView('product');
      }
    }
  }, [products]);

  // Filtered product catalog according to active category and real-time search query
  const filteredProducts = products.filter(p => {
    const matchesCategory =
      activeCategory === 'all' ||
      p.category.toLowerCase() === activeCategory.toLowerCase();

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
  });

  // Add item to cart
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast.success('Piece added to shopping bag!');
  };

  // Update cart quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
      );
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Piece removed from bag');
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Saved to wishlist!');
        return [...prev, productId];
      }
    });
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Handle new customer review submitted
  const handleAddReview = (newRev: { name: string; role: string; text: string; rating: number }) => {
    const reviewObj: Review = {
      id: Date.now().toString(),
      name: newRev.name,
      role: newRev.role || 'Verified Patron',
      text: newRev.text,
      rating: newRev.rating,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([reviewObj, ...reviews]);
    toast.success('Thank you! Your patron review is now live.');
  };

  // If logged in user is Admin, render dedicated Master Admin Dashboard view
  if (isAuthenticated && currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#faf8f4] dark:bg-[#141414] text-[#1c1b1b] dark:text-white">
        <Toaster position="top-right" reverseOrder={false} />
        <AdminDashboard token={authToken} onLogout={handleLogout} />
      </div>
    );
  }

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-[#121214] text-[#171717] dark:text-white transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Unified Ultra-Luxury Header with Smart Search, Wishlist, Cart & Profile */}
      <Header
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => isAuthenticated ? handleNavigateView('dashboard') : setIsAuthModalOpen(true)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          handleNavigateView('product');
        }}
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleNavigateView('shop');
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        currentView={currentView}
        onNavigateView={(v) => handleNavigateView(v as any)}
        isAuthenticated={isAuthenticated}
        user={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Breadcrumb Navigation for sub-views */}
      {currentView !== 'home' && (
        <div className="pt-24 md:pt-28">
          <Breadcrumb
            currentView={currentView}
            activeCategory={activeCategory}
            selectedProduct={selectedProduct}
            onNavigateView={(v) => handleNavigateView(v as any)}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className={currentView === 'home' ? 'w-full pt-20 md:pt-24' : 'w-full pt-2 min-h-[70vh]'}>
        {currentView === 'home' && (
          <GwellaryHome
            categories={categories}
            products={products}
            reviews={reviews}
            wishlistIds={wishlistIds}
            cartCount={cartTotalCount}
            onShop={(category) => {
              setActiveCategory(category || 'all');
              handleNavigateView('shop');
            }}
            onProduct={(product) => {
              setSelectedProduct(product);
              handleNavigateView('product');
            }}
            onAdd={(product) => handleAddToCart(product, 1)}
            onWishlist={handleToggleWishlist}
            onCart={() => setIsCartOpen(true)}
            onAccount={() => isAuthenticated ? handleNavigateView('dashboard') : setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'dashboard' && (
          <UserDashboardView
            user={currentUser}
            onNavigate={(v) => handleNavigateView(v as any)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              handleNavigateView('product');
            }}
            wishlistCount={wishlistIds.length}
            initialTab={currentUser?.role === 'admin' ? 'admin' : 'profile'}
            onLogout={handleLogout}
            authToken={authToken}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'orders' && (
          <UserDashboardView
            user={currentUser}
            onNavigate={(v) => handleNavigateView(v as any)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              handleNavigateView('product');
            }}
            wishlistCount={wishlistIds.length}
            initialTab="orders"
            onLogout={handleLogout}
            authToken={authToken}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'addresses' && (
          <UserDashboardView
            user={currentUser}
            onNavigate={(v) => handleNavigateView(v as any)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              handleNavigateView('product');
            }}
            wishlistCount={wishlistIds.length}
            initialTab="address"
            onLogout={handleLogout}
            authToken={authToken}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailsView
            product={selectedProduct || undefined}
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
            wishlistIds={wishlistIds}
            onNavigateToCheckout={(p) => {
              handleAddToCart(p, 1);
              handleNavigateView('checkout');
            }}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            onCompletePurchase={() => {
              setCartItems([]);
              handleNavigateView('orders');
            }}
            onNavigate={(v) => handleNavigateView(v as any)}
          />
        )}

        {currentView === 'shop' && (
          <ShopCollectionView
            products={filteredProducts}
            initialCategory={activeCategory}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              handleNavigateView('product');
            }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {currentView === 'about' && (
          <AboutView onExploreCollection={() => handleNavigateView('shop')} />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}
      </main>

      {/* Global Luxury Footer with Dedicated Admin Portal Access */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleNavigateView('shop');
        }}
        onOpenAdminAuth={() => {
          if (isAuthenticated && currentUser?.role === 'admin') {
            handleNavigateView('dashboard');
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }}
        onNavigateView={(v) => handleNavigateView(v as any)}
      />

      {/* Modals & Slide Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          handleNavigateView('checkout');
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onClearCart={() => setCartItems([])}
        currentUser={currentUser}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onAddReview={handleAddReview}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.length}
        user={currentUser}
        onNavigate={(v) => handleNavigateView(v as any)}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onSuccessLogin={handleAuthSuccess}
      />

      {/* Dedicated Standalone Admin Portal Access Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAdminAuthSuccess={handleAuthSuccess}
      />

      {/* Floating Action Buttons: Scroll to Top & WhatsApp Concierge */}
      <FloatingWidgets />
    </div>
  );
}
