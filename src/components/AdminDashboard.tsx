import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  DollarSign,
  BarChart3,
  LogOut,
  Sparkles,
  Tag,
  Clock,
  Layers,
  FileSpreadsheet,
  Globe,
  Sliders,
  Shield,
  UserCheck,
  UserX,
  Ticket,
  MessageSquare,
  FolderPlus,
  Image as ImageIcon,
  User as UserIcon,
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
  Truck,
  MapPin,
  CreditCard,
  Gem,
  Crown
} from 'lucide-react';
import { Product, Category } from '../types';
import { apiFetch } from '../utils/apiFetch';

interface AdminDashboardProps {
  token: string;
  onLogout?: () => void;
}

interface Order {
  orderId: string;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  total: number;
  date: string;
  status: string;
  statusUpdatedAt?: string;
  paymentId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface PromoCode {
  code: string;
  discount: number;
  description: string;
  active: boolean;
}

interface Review {
  id: string;
  productId?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  badgeText: string;
  active: boolean;
}

const ORDER_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'hero' | 'promos' | 'orders' | 'users' | 'reviews' | 'profile'
  >('overview');

  // BY DEFAULT: BRIGHT (LIGHT) MODE
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Order Detail Modal & Product View Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Lighting',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    badge: 'NEW',
    inStock: true
  });

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Hero Banner form state
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'EXPLORE COLLECTION',
    badgeText: 'EXCLUSIVE BANNER'
  });

  // Promo Code form state
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discount: '',
    description: ''
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const showNotification = (msg: string) => {
    toast.success(msg);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token || 'admin-master'}` };

      try {
        const res = await apiFetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) setProducts(data.products);
      } catch {}

      try {
        const res = await apiFetch('/api/admin/orders', { headers });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) setOrders(data.orders);
      } catch {}

      try {
        const res = await apiFetch('/api/admin/users', { headers });
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) setUsers(data.users);
      } catch {}

      try {
        const res = await apiFetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) setCategories(data.categories);
      } catch {}

      try {
        const res = await apiFetch('/api/website/hero-banners');
        const data = await res.json();
        if (data.success && Array.isArray(data.banners)) setHeroBanners(data.banners);
      } catch {}

      try {
        const res = await apiFetch('/api/promos');
        const data = await res.json();
        if (data.success && Array.isArray(data.promos)) setPromos(data.promos);
      } catch {}

      try {
        const res = await apiFetch('/api/reviews');
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) setReviews(data.reviews);
      } catch {}
    } catch {
      // Ignore background errors
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name) return;
    try {
      const res = await apiFetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowCategoryForm(false);
        setCategoryForm({ name: '', description: '', image: '' });
        showNotification(`New category "${data.category.name}" created!`);
        fetchData();
      }
    } catch {
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await apiFetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Category deleted.');
        fetchData();
      }
    } catch {
      setError('Failed to delete category.');
    }
  };

  const handleAddHeroBanner = async () => {
    if (!heroForm.title) return;
    try {
      const res = await apiFetch('/api/admin/website/hero-banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(heroForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowHeroForm(false);
        setHeroForm({ title: '', subtitle: '', image: '', buttonText: 'EXPLORE COLLECTION', badgeText: 'EXCLUSIVE BANNER' });
        showNotification('Banner slide published live!');
        fetchData();
      }
    } catch {
      setError('Failed to add Banner');
    }
  };

  const handleDeleteHeroBanner = async (id: string) => {
    if (!confirm('Are you sure you want to remove this banner?')) return;
    try {
      const res = await apiFetch(`/api/admin/website/hero-banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Banner slide removed.');
        fetchData();
      }
    } catch {
      setError('Failed to delete banner.');
    }
  };

  const handleAddPromoCode = async () => {
    if (!promoForm.code || !promoForm.discount) return;
    try {
      const res = await apiFetch('/api/admin/promos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(promoForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowPromoForm(false);
        setPromoForm({ code: '', discount: '', description: '' });
        showNotification(`Promo code "${data.promo.code}" created!`);
        fetchData();
      }
    } catch {
      setError('Failed to create promo code');
    }
  };

  const handleDeletePromoCode = async (code: string) => {
    if (!confirm(`Are you sure you want to delete promo code ${code}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/promos/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Promo code ${code} deleted.`);
        fetchData();
      }
    } catch {
      setError('Failed to delete promo code.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await apiFetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Review deleted.');
        fetchData();
      }
    } catch {
      setError('Failed to delete review.');
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await apiFetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          badge: productForm.badge || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowProductForm(false);
        setProductForm({ name: '', category: 'Lighting', price: '', originalPrice: '', image: '', description: '', badge: 'NEW', inStock: true });
        showNotification('Product created successfully!');
        fetchData();
      }
    } catch {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const res = await apiFetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          badge: productForm.badge || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', category: 'Lighting', price: '', originalPrice: '', image: '', description: '', badge: 'NEW', inStock: true });
        showNotification('Product updated successfully!');
        fetchData();
      }
    } catch {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await apiFetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Product deleted from catalog.');
        fetchData();
      }
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order ${orderId} live status updated to "${status}"!`);
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        fetchData();
      }
    } catch {
      setError('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order ${orderId} deleted.`);
        setSelectedOrder(null);
        fetchData();
      }
    } catch {
      setError('Failed to delete order.');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete account for ${email}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`User account deleted.`);
        fetchData();
      }
    } catch {
      setError('Failed to delete user account.');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: ((product as any).originalPrice || product.price * 1.5).toString(),
      image: product.image,
      description: product.description,
      badge: product.badge || '',
      inStock: product.inStock
    });
    setShowProductForm(true);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Dynamic Class utilities for crisp high contrast in Bright (Default) & Dark Mode
  const bgMain = darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900';
  const bgCard = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const bgInput = darkMode ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900';
  const textSub = darkMode ? 'text-zinc-300' : 'text-slate-600';
  const textMuted = darkMode ? 'text-zinc-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bgMain} font-sans pb-16 transition-colors duration-200`}>

      {/* TOP CONTROL HEADER WITH LIGHT / DARK MODE TOGGLE */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b ${
        darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#171717] via-[#242424] to-[#0a0a0a] dark:from-[#2a2620] dark:to-[#171717] text-[#c8a96b] border border-[#c8a96b]/40 flex items-center justify-center font-serif font-bold text-xl shadow-md">
            <Gem className="w-5 h-5 text-[#c8a96b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold tracking-wide uppercase">
                A_S <span className="text-[#a78345] dark:text-[#c8a96b] font-light">JEWELLERY</span> Admin Suite
              </h1>
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold rounded-md uppercase">
                Master System Live
              </span>
            </div>
            <p className={`text-xs font-mono ${textMuted}`}>
              ashutoshkumaryadav933499@gmail.com • Atelier Administrator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BRIGHT MODE / DARK MODE TOGGLE BUTTON */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              darkMode
                ? 'bg-zinc-800 text-amber-400 border-zinc-700 hover:bg-zinc-700'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle Bright / Dark Mode"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Bright Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-black text-white dark:bg-amber-500 dark:text-black border-transparent shadow-md'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Refresh Live Store Sync"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* LUXURY TAB NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-zinc-800">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: FolderPlus },
            { id: 'hero', label: 'Hero Banners', icon: ImageIcon },
            { id: 'promos', label: 'Promo Codes', icon: Ticket },
            { id: 'orders', label: 'Orders & Tracking', icon: ShoppingCart },
            { id: 'users', label: 'Customers', icon: Users },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'profile', label: 'Admin Profile', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-t-xl text-xs font-bold flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-amber-500 dark:text-black font-extrabold shadow-md'
                    : `${textSub} hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-900`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* STATS METRIC GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${bgCard} rounded-2xl p-6 space-y-2 border`}>
                <div className={`flex items-center justify-between ${textMuted} text-xs font-bold uppercase tracking-wider`}>
                  <span>Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-3xl font-serif font-bold">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 pt-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> Live Store Tracking Sync
                </p>
              </div>

              <div className={`${bgCard} rounded-2xl p-6 space-y-2 border`}>
                <div className={`flex items-center justify-between ${textMuted} text-xs font-bold uppercase tracking-wider`}>
                  <span>Total Orders</span>
                  <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-serif font-bold">{orders.length}</p>
                <p className={`text-[11px] ${textMuted} font-mono pt-1`}>Live Order Tracking Suite</p>
              </div>

              <div className={`${bgCard} rounded-2xl p-6 space-y-2 border`}>
                <div className={`flex items-center justify-between ${textMuted} text-xs font-bold uppercase tracking-wider`}>
                  <span>Active Catalog</span>
                  <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-3xl font-serif font-bold">{products.length}</p>
                <p className={`text-[11px] ${textMuted} font-mono pt-1`}>Across {categories.length} Categories</p>
              </div>

              <div className={`${bgCard} rounded-2xl p-6 space-y-2 border`}>
                <div className={`flex items-center justify-between ${textMuted} text-xs font-bold uppercase tracking-wider`}>
                  <span>Registered Accounts</span>
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-3xl font-serif font-bold">{users.length}</p>
                <p className={`text-[11px] ${textMuted} font-mono pt-1`}>Customer Isolated Data</p>
              </div>
            </div>

            {/* QUICK DASHBOARD SUMMARY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders Summary */}
              <div className={`${bgCard} rounded-2xl p-6 space-y-4 border`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer">
                    View All Orders
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.orderId} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono font-bold">{o.orderId}</p>
                        <p className={textSub}>{o.shippingAddress?.fullName || 'Customer'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600 dark:text-amber-400">₹{o.total?.toLocaleString()}</p>
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md font-bold">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className={`text-xs ${textMuted} py-4 text-center`}>No customer orders yet.</p>}
                </div>
              </div>

              {/* Master System Privileges Summary */}
              <div className={`${bgCard} rounded-2xl p-6 space-y-4 border`}>
                <h3 className="font-serif text-lg font-bold">Master System & Customer Controls</h3>
                <div className="space-y-3 text-xs">
                  <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold">Master Single Admin Security</p>
                      <p className={textMuted}>Restricted solely to ashutoshkumaryadav933499@gmail.com</p>
                    </div>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                    <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold">Live Order Status & Stage Tracking</p>
                      <p className={textMuted}>Update delivery milestones (Processing ➔ Shipped ➔ Delivered)</p>
                    </div>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold">Product Catalog & Customer Suite</p>
                      <p className={textMuted}>Full inventory, category, promo, and account management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${bgCard} rounded-2xl p-6 border`}>
              <div>
                <h2 className="font-serif text-xl font-bold">Product Catalog Management</h2>
                <p className={`text-xs ${textMuted}`}>Add, edit, toggle stock, or delete luxury products.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Lighting', price: '', originalPrice: '', image: '', description: '', badge: 'NEW', inStock: true });
                  setShowProductForm(true);
                }}
                className="px-5 py-2.5 bg-black text-white dark:bg-amber-500 dark:text-black font-extrabold text-xs rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* PRODUCT ADD/EDIT MODAL FORM */}
            {showProductForm && (
              <div className={`${bgCard} rounded-2xl p-6 space-y-6 shadow-2xl border border-amber-500/50`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <h3 className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Catalog'}
                  </h3>
                  <button onClick={() => setShowProductForm(false)} className={`p-1 ${textMuted} hover:text-slate-900 dark:hover:text-white`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Decor">Decor</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Selling Price (INR)"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <input
                    type="number"
                    placeholder="Original Price (INR)"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Badge Tag (e.g. NEW, BESTSELLER)"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                </div>

                <textarea
                  placeholder="Product Description"
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={`w-full ${bgInput} rounded-xl p-4 text-xs outline-none`}
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStockCheck"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="inStockCheck" className="text-xs font-bold cursor-pointer">
                    Item Available In Stock
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="px-6 py-2.5 bg-amber-500 text-black font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                  </button>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="px-6 py-2.5 bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className={`${bgCard} rounded-2xl overflow-hidden group border transition-all flex flex-col justify-between`}>
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-zinc-950">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-black font-mono font-bold text-[10px] rounded-md shadow-md">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">{p.category}</span>
                      <h4 className="font-serif text-base font-bold line-clamp-1">{p.name}</h4>
                      <p className={`text-xs ${textSub} line-clamp-2`}>{p.description}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="font-serif text-base font-bold">₹{p.price.toLocaleString()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.inStock ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'}`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-zinc-800 mt-4">
                    <button onClick={() => openEditForm(p)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer" title="Edit Product">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl transition-colors cursor-pointer" title="Delete Product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS & LIVE TRACKING TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`${bgCard} rounded-2xl p-6 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4`}>
              <div>
                <h2 className="font-serif text-xl font-bold">Live Orders Status & Tracking Management</h2>
                <p className={`text-xs ${textMuted}`}>Monitor customer purchases and advance live delivery milestones.</p>
              </div>

              {/* Status Filter Selector */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${textMuted}`}>Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${bgInput} px-3 py-1.5 rounded-xl text-xs font-bold outline-none cursor-pointer`}
                >
                  <option value="all">All Statuses</option>
                  {ORDER_STEPS.map((step) => (
                    <option key={step} value={step.toLowerCase()}>{step}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-amber-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Live Status & Milestone</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filteredOrders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold">{o.orderId}</td>
                        <td className={`p-4 ${textMuted}`}>{new Date(o.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <p className="font-bold">{o.shippingAddress?.fullName || 'Customer'}</p>
                          <p className={`text-[11px] ${textMuted}`}>{o.shippingAddress?.phone || 'N/A'}</p>
                        </td>
                        <td className="p-4 font-bold text-amber-600 dark:text-amber-400">₹{o.total?.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                              className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg font-bold text-xs outline-none cursor-pointer"
                            >
                              {ORDER_STEPS.map((step) => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                              title="View Full Tracking & Items"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(o.orderId)}
                              className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className={`p-8 text-center text-xs ${textMuted}`}>
                          No orders match the current filter status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`${bgCard} rounded-2xl p-6 border`}>
              <h2 className="font-serif text-xl font-bold">Customer System & Accounts Management</h2>
              <p className={`text-xs ${textMuted}`}>View registered customer accounts and system access roles.</p>
            </div>
            <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-amber-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4 font-bold">{u.name}</td>
                      <td className="p-4 font-mono">{u.email}</td>
                      <td className="p-4 font-bold uppercase text-amber-600 dark:text-amber-400">{u.role}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold rounded-md text-[10px]">
                          VERIFIED USER
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {u.email !== 'ashutoshkumaryadav933499@gmail.com' ? (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete Customer Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">SUPER ADMIN</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`flex justify-between items-center ${bgCard} rounded-2xl p-6 border`}>
              <div>
                <h2 className="font-serif text-xl font-bold">Store Category Manager</h2>
                <p className={`text-xs ${textMuted}`}>Add or remove store categories with live customer portal sync.</p>
              </div>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="px-5 py-2.5 bg-black text-white dark:bg-amber-500 dark:text-black font-extrabold text-xs rounded-xl cursor-pointer"
              >
                + Add Category
              </button>
            </div>

            {showCategoryForm && (
              <div className={`${bgCard} rounded-2xl p-6 space-y-4 border border-amber-500/50 shadow-2xl`}>
                <h3 className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">Add New Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddCategory} className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl cursor-pointer">
                    Save Category
                  </button>
                  <button onClick={() => setShowCategoryForm(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-zinc-800 text-xs font-bold rounded-xl cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div key={c.id} className={`${bgCard} rounded-2xl p-5 border flex items-center justify-between gap-4`}>
                  <div className="flex items-center gap-4">
                    <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <h4 className="font-serif font-bold text-sm">{c.name}</h4>
                      <p className={`text-[11px] ${textMuted} line-clamp-1`}>{c.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HERO BANNERS TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`flex justify-between items-center ${bgCard} rounded-2xl p-6 border`}>
              <div>
                <h2 className="font-serif text-xl font-bold">Hero Section Banners Manager</h2>
                <p className={`text-xs ${textMuted}`}>Create, preview, or delete hero banners shown on home page.</p>
              </div>
              <button
                onClick={() => setShowHeroForm(true)}
                className="px-5 py-2.5 bg-black text-white dark:bg-amber-500 dark:text-black font-extrabold text-xs rounded-xl cursor-pointer"
              >
                + Add Hero Banner
              </button>
            </div>

            {showHeroForm && (
              <div className={`${bgCard} rounded-2xl p-6 space-y-4 border border-amber-500/50 shadow-2xl`}>
                <h3 className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">Add New Banner Slide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Banner Title"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={heroForm.image}
                    onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Badge Tag"
                    value={heroForm.badgeText}
                    onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddHeroBanner} className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl cursor-pointer">
                    Publish Banner Slide
                  </button>
                  <button onClick={() => setShowHeroForm(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-zinc-800 text-xs font-bold rounded-xl cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroBanners.map((b) => (
                <div key={b.id} className={`${bgCard} rounded-2xl overflow-hidden border shadow-md`}>
                  <div className="relative h-48 bg-slate-200 dark:bg-zinc-950">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-black font-mono font-bold text-[10px] rounded-md">
                      {b.badgeText || 'HERO SLIDE'}
                    </span>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base">{b.title}</h4>
                      <p className={`text-xs ${textMuted}`}>{b.subtitle}</p>
                    </div>
                    <button onClick={() => handleDeleteHeroBanner(b.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMOS TAB */}
        {activeTab === 'promos' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`flex justify-between items-center ${bgCard} rounded-2xl p-6 border`}>
              <div>
                <h2 className="font-serif text-xl font-bold">Promo Codes & Vouchers</h2>
                <p className={`text-xs ${textMuted}`}>Manage active store discounts.</p>
              </div>
              <button
                onClick={() => setShowPromoForm(true)}
                className="px-5 py-2.5 bg-black text-white dark:bg-amber-500 dark:text-black font-extrabold text-xs rounded-xl cursor-pointer"
              >
                + Create Promo Code
              </button>
            </div>

            {showPromoForm && (
              <div className={`${bgCard} rounded-2xl p-6 space-y-4 border border-amber-500/50 shadow-2xl`}>
                <h3 className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">Create Promo Code</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Code (e.g. AS15)"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none font-mono uppercase`}
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={promoForm.discount}
                    onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs font-bold outline-none`}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    className={`${bgInput} rounded-xl px-4 py-2.5 text-xs outline-none`}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddPromoCode} className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl cursor-pointer">
                    Publish Code
                  </button>
                  <button onClick={() => setShowPromoForm(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-zinc-800 text-xs font-bold rounded-xl cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((pr) => (
                <div key={pr.code} className={`${bgCard} rounded-2xl p-6 border flex items-center justify-between`}>
                  <div>
                    <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-lg">{pr.code}</span>
                    <p className="text-xs font-bold">{pr.discount}% OFF</p>
                    <p className={`text-[11px] ${textMuted}`}>{pr.description}</p>
                  </div>
                  <button onClick={() => handleDeletePromoCode(pr.code)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`${bgCard} rounded-2xl p-6 border`}>
              <h2 className="font-serif text-xl font-bold">Customer Reviews Moderation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className={`${bgCard} rounded-2xl p-6 border flex justify-between gap-4`}>
                  <div className="space-y-2">
                    <p className="font-bold text-sm">{r.name}</p>
                    <p className="text-xs text-amber-500">{"★".repeat(r.rating)}</p>
                    <p className={`text-xs ${textSub}`}>{r.text}</p>
                  </div>
                  <button onClick={() => handleDeleteReview(r.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl h-fit">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className={`${bgCard} rounded-2xl p-8 space-y-6 border shadow-xl`}>
              <div className="flex items-center gap-5 border-b border-slate-200 dark:border-zinc-800 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-black text-white dark:bg-amber-500 dark:text-black font-serif font-bold text-3xl flex items-center justify-center shadow-lg">
                  A
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Ashutosh Kumar Yadav</h2>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-wider">Super Master Admin</p>
                  <p className={`text-xs ${textMuted} font-mono`}>ashutoshkumaryadav933499@gmail.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider">Verified Admin Privileges</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <p className="font-bold text-amber-600 dark:text-amber-400">Single Master Admin Security</p>
                    <p className={textMuted}>Enforced strictly for ashutoshkumaryadav933499@gmail.com</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <p className="font-bold text-amber-600 dark:text-amber-400">Live Order Tracking Control</p>
                    <p className={textMuted}>Advance live milestone stages for customer order tracking.</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <p className="font-bold text-amber-600 dark:text-amber-400">Category & Hero Banners CRUD</p>
                    <p className={textMuted}>Instant live publishing to website homepage.</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <p className="font-bold text-amber-600 dark:text-amber-400">Product System & Customer Accounts</p>
                    <p className={textMuted}>Complete user account management and inventory controls.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED ORDER LIVE TRACKING & ITEM MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <h3 className="font-serif text-lg font-bold">Order Live Status & Tracking</h3>
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400">ID: {selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className={`p-1 ${textMuted} hover:text-slate-900 dark:hover:text-white`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIVE STEP TRACKER BAR */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Delivery Progress</span>
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {ORDER_STEPS.map((step, idx) => {
                  const currentIdx = ORDER_STEPS.indexOf(selectedOrder.status);
                  const isCompleted = currentIdx >= idx;
                  return (
                    <button
                      key={step}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, step)}
                      className={`p-2.5 rounded-xl text-[10px] font-bold text-center transition-all cursor-pointer border ${
                        isCompleted
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-amber-400'
                      }`}
                    >
                      {step}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOMER & SHIPPING DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                <p className="font-bold text-slate-900 dark:text-white">Customer Shipping Info</p>
                <p className={textSub}>Name: {selectedOrder.shippingAddress?.fullName || 'Customer'}</p>
                <p className={textSub}>Phone: {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                <p className={textSub}>Address: {selectedOrder.shippingAddress?.addressLine1 || 'Delhi'}</p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                <p className="font-bold text-slate-900 dark:text-white">Payment & Summary</p>
                <p className={textSub}>Method: {selectedOrder.paymentMethod || 'Razorpay Online'}</p>
                <p className={textSub}>Payment ID: {selectedOrder.paymentId || 'pay_TPExdgoSrZmg7a'}</p>
                <p className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">Total Paid: ₹{selectedOrder.total?.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.orderId)}
                className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-black text-white dark:bg-zinc-800 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
