import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Package,
  CheckCircle2,
  RotateCcw,
  Truck,
  FileText,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  status: 'ordered' | 'packed' | 'shipped' | 'delivered' | 'returned';
  estimatedDelivery?: string;
  carrier?: string;
  trackingNumber?: string;
  checkpoints: {
    title: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  overallStatus: 'ordered' | 'packed' | 'shipped' | 'delivered' | 'returned';
  items: OrderItem[];
  shippingAddress: string;
}

interface OrderHistoryViewProps {
  onNavigate: (view: string) => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'LX-90214',
    date: 'Oct 24, 2024',
    totalAmount: 482.00,
    overallStatus: 'shipped',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        id: 'item-1',
        name: 'Luxe Hydration Vessel',
        variant: 'Silver / 500ml',
        price: 85.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
        status: 'shipped',
        estimatedDelivery: 'Wednesday, Oct 30',
        carrier: 'FedEx Express (#FX-88902)',
        trackingNumber: '92001928371102',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Online Store', timestamp: 'Oct 24, 09:15 AM', completed: true },
          { title: 'Packed & Sealed', location: 'Warehouse Facility A, Chicago IL', timestamp: 'Oct 25, 02:40 PM', completed: true },
          { title: 'In Transit with Carrier', location: 'Distribution Center, Denver CO', timestamp: 'Oct 26, 08:20 AM', completed: true },
          { title: 'Out for Delivery', location: 'Destination Facility, Springfield OR', timestamp: 'Pending', completed: false }
        ]
      },
      {
        id: 'item-2',
        name: 'Tactile Wireless Keyboard',
        variant: 'Carbon Black / Mechanical',
        price: 397.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80',
        status: 'packed',
        estimatedDelivery: 'Thursday, Oct 31',
        carrier: 'UPS Ground (#UPS-44120)',
        trackingNumber: '1Z9999999999999999',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Online Store', timestamp: 'Oct 24, 09:15 AM', completed: true },
          { title: 'Packed & Quality Verified', location: 'Tech Hub, Austin TX', timestamp: 'Oct 26, 11:05 AM', completed: true },
          { title: 'Handed to Courier', location: 'Austin Parcel Depot', timestamp: 'Oct 27, 07:00 AM', completed: false },
          { title: 'Delivered', location: 'Recipient Address', timestamp: 'Pending', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'LX-88122',
    date: 'Sep 12, 2024',
    totalAmount: 1240.00,
    overallStatus: 'delivered',
    shippingAddress: '10880 Wilshire Blvd, Los Angeles, CA',
    items: [
      {
        id: 'item-3',
        name: 'Minimalist Architectural Desk Lamp',
        variant: 'Matte Brass / Smart LED',
        price: 450.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered Sep 15, 2024',
        carrier: 'DHL Express (#DHL-90111)',
        trackingNumber: '4481029481',
        checkpoints: [
          { title: 'Order Confirmed', location: 'A_S JEWELLERY Atelier', timestamp: 'Sep 12, 10:00 AM', completed: true },
          { title: 'Item Packed', location: 'Design Lab, NYC', timestamp: 'Sep 12, 04:15 PM', completed: true },
          { title: 'Shipped', location: 'Air Freight Hub', timestamp: 'Sep 13, 01:00 AM', completed: true },
          { title: 'Delivered & Signed', location: 'Front Desk / Concierge', timestamp: 'Sep 15, 02:30 PM', completed: true }
        ]
      },
      {
        id: 'item-4',
        name: 'Ergonomic Merino Lounge Chair',
        variant: 'Oatmeal Wool / Walnut',
        price: 790.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered Sep 15, 2024',
        carrier: 'White Glove Freight',
        trackingNumber: 'WG-771822',
        checkpoints: [
          { title: 'Order Confirmed', location: 'A_S JEWELLERY Atelier', timestamp: 'Sep 12, 10:00 AM', completed: true },
          { title: 'Packed', location: 'Furniture Works, NC', timestamp: 'Sep 13, 08:00 AM', completed: true },
          { title: 'Shipped', location: 'Regional Distribution', timestamp: 'Sep 14, 09:30 AM', completed: true },
          { title: 'Delivered', location: 'Living Room Placement', timestamp: 'Sep 15, 02:30 PM', completed: true }
        ]
      }
    ]
  },
  {
    id: 'ord-3',
    orderNumber: 'LX-87001',
    date: 'Aug 04, 2024',
    totalAmount: 125.00,
    overallStatus: 'returned',
    shippingAddress: '450 Sutter St, San Francisco, CA',
    items: [
      {
        id: 'item-5',
        name: 'Luxe Hydration Vessel',
        variant: 'Midnight Black / 750ml',
        price: 125.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
        status: 'returned',
        estimatedDelivery: 'Returned & Refunded',
        carrier: 'USPS Priority Return',
        trackingNumber: '940011189922',
        checkpoints: [
          { title: 'Return Requested', location: 'Customer Care', timestamp: 'Aug 08, 11:20 AM', completed: true },
          { title: 'Package Dropped Off', location: 'USPS Post Office', timestamp: 'Aug 09, 02:15 PM', completed: true },
          { title: 'Received at Facility', location: 'Return Center, Reno NV', timestamp: 'Aug 12, 09:00 AM', completed: true },
          { title: 'Refund Issued to Card', location: 'Payment Gateway', timestamp: 'Aug 13, 10:30 AM', completed: true }
        ]
      }
    ]
  },
  {
    id: 'ord-4',
    orderNumber: 'LX-85210',
    date: 'Jul 19, 2024',
    totalAmount: 310.00,
    overallStatus: 'delivered',
    shippingAddress: '55 E 52nd St, New York, NY',
    items: [
      {
        id: 'item-6',
        name: 'Ceramic Studio Pour-Over Set',
        variant: 'Speckled Charcoal',
        price: 180.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered Jul 22, 2024',
        carrier: 'FedEx Home Delivery',
        trackingNumber: '782910482201',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Store', timestamp: 'Jul 19, 08:30 AM', completed: true },
          { title: 'Packed', location: 'Brooklyn Craft Works', timestamp: 'Jul 19, 03:00 PM', completed: true },
          { title: 'Shipped', location: 'NYC Metro Hub', timestamp: 'Jul 20, 06:15 AM', completed: true },
          { title: 'Delivered', location: 'Front Door', timestamp: 'Jul 22, 11:45 AM', completed: true }
        ]
      },
      {
        id: 'item-7',
        name: 'Artisan Glass Espresso Cups (Set of 2)',
        variant: 'Smoked Glass',
        price: 130.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered Jul 22, 2024',
        carrier: 'FedEx Home Delivery',
        trackingNumber: '782910482201',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Store', timestamp: 'Jul 19, 08:30 AM', completed: true },
          { title: 'Packed', location: 'Brooklyn Craft Works', timestamp: 'Jul 19, 03:00 PM', completed: true },
          { title: 'Shipped', location: 'NYC Metro Hub', timestamp: 'Jul 20, 06:15 AM', completed: true },
          { title: 'Delivered', location: 'Front Door', timestamp: 'Jul 22, 11:45 AM', completed: true }
        ]
      }
    ]
  },
  {
    id: 'ord-5',
    orderNumber: 'LX-82190',
    date: 'Jun 01, 2024',
    totalAmount: 620.00,
    overallStatus: 'delivered',
    shippingAddress: '200 Clarendon St, Boston, MA',
    items: [
      {
        id: 'item-8',
        name: 'Noise-Cancelling Over-Ear Headphones',
        variant: 'Space Gray / Leather',
        price: 620.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered Jun 04, 2024',
        carrier: 'UPS Next Day Air',
        trackingNumber: '1Z882001928371',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Store', timestamp: 'Jun 01, 11:00 AM', completed: true },
          { title: 'Packed', location: 'Boston Logistics Center', timestamp: 'Jun 01, 05:00 PM', completed: true },
          { title: 'Shipped', location: 'Logan Airport Cargo Hub', timestamp: 'Jun 02, 02:00 AM', completed: true },
          { title: 'Delivered', location: 'Mail Room', timestamp: 'Jun 04, 01:15 PM', completed: true }
        ]
      }
    ]
  },
  {
    id: 'ord-6',
    orderNumber: 'LX-81005',
    date: 'May 14, 2024',
    totalAmount: 210.00,
    overallStatus: 'delivered',
    shippingAddress: '100 Peachtree St, Atlanta, GA',
    items: [
      {
        id: 'item-9',
        name: 'Sculptural Ceramic Vase',
        variant: 'Terracotta Matte',
        price: 210.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80',
        status: 'delivered',
        estimatedDelivery: 'Delivered May 18, 2024',
        carrier: 'USPS Priority',
        trackingNumber: '920550001928',
        checkpoints: [
          { title: 'Order Confirmed', location: 'Store', timestamp: 'May 14, 02:00 PM', completed: true },
          { title: 'Packed', location: 'Atlanta Warehouse', timestamp: 'May 15, 09:30 AM', completed: true },
          { title: 'Shipped', location: 'Georgia Sorting Center', timestamp: 'May 16, 08:00 AM', completed: true },
          { title: 'Delivered', location: 'Porch Drop-off', timestamp: 'May 18, 04:00 PM', completed: true }
        ]
      }
    ]
  }
];

// Tracking Step definitions
const TRACKING_STEPS = [
  { key: 'ordered', label: 'Ordered', desc: 'Order confirmed & paid' },
  { key: 'packed', label: 'Packed', desc: 'Prepared at facility' },
  { key: 'shipped', label: 'Shipped', desc: 'In transit with courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered & signed' }
];

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All Orders');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Load user-specific isolated orders
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('luxe_current_user') || sessionStorage.getItem('luxe_current_user');
      let userEmail = '';
      if (userStr) {
        const u = JSON.parse(userStr);
        userEmail = u.email;
      }
      const userOrdersKey = userEmail ? `luxe_orders_${userEmail}` : 'luxe_orders';
      const storedOrders = localStorage.getItem(userOrdersKey) || sessionStorage.getItem(userOrdersKey);
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      }
    } catch {}
  }, []);

  // Tracking Drawer State
  const [activeTrackingItem, setActiveTrackingItem] = useState<{ order: Order; item: OrderItem } | null>(null);

  // Simulation State for Real-Time progress
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);

  // Pagination & Lazy Loading States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === 'All Statuses' ||
      order.overallStatus.toLowerCase() === statusFilter.toLowerCase();

    // Time filter
    let matchesTime = true;
    if (timeFilter === 'Last 6 Months') {
      matchesTime = order.date.includes('2024') || order.date.includes('Oct') || order.date.includes('Sep');
    } else if (timeFilter === 'Year 2024') {
      matchesTime = order.date.includes('2024');
    } else if (timeFilter === 'Year 2023') {
      matchesTime = order.date.includes('2023');
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setIsPageLoading(true);
    setCurrentPage(newPage);
    setTimeout(() => {
      setIsPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  // Real-time live status update simulation
  useEffect(() => {
    let interval: any;
    if (isLiveSimulating) {
      interval = setInterval(() => {
        setOrders((prevOrders) =>
          prevOrders.map((ord) => {
            // Find item in shipped state and update its checkpoints
            if (ord.overallStatus === 'shipped') {
              const updatedItems = ord.items.map((item) => {
                if (item.status === 'shipped') {
                  const now = new Date();
                  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} PM`;
                  const hasPending = item.checkpoints.some((c) => !c.completed);
                  if (hasPending) {
                    const newCheckpoints = [...item.checkpoints];
                    const pendingIdx = newCheckpoints.findIndex((c) => !c.completed);
                    if (pendingIdx !== -1) {
                      newCheckpoints[pendingIdx] = {
                        ...newCheckpoints[pendingIdx],
                        timestamp: `Just now (${timeStr})`,
                        completed: true
                      };
                    }
                    const allDone = newCheckpoints.every((c) => c.completed);
                    return {
                      ...item,
                      status: allDone ? ('delivered' as const) : item.status,
                      checkpoints: newCheckpoints
                    };
                  }
                }
                return item;
              });

              return {
                ...ord,
                overallStatus: updatedItems.every((i) => i.status === 'delivered') ? 'delivered' : ord.overallStatus,
                items: updatedItems
              };
            }
            return ord;
          })
        );
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const getStepIndex = (status: string): number => {
    switch (status) {
      case 'ordered':
        return 0;
      case 'packed':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'returned':
        return -1;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shipped':
      case 'in transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold tracking-widest rounded-full uppercase">
            <Truck className="w-3 h-3 text-amber-500" />
            IN TRANSIT
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold tracking-widest rounded-full uppercase">
            <Package className="w-3 h-3 text-blue-500" />
            PACKED
          </span>
        );
      case 'ordered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-[10px] font-bold tracking-widest rounded-full uppercase">
            <FileText className="w-3 h-3 text-purple-500" />
            ORDERED
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-widest rounded-full uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            DELIVERED
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold tracking-widest rounded-full uppercase">
            <RotateCcw className="w-3 h-3 text-rose-500" />
            RETURNED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 text-[10px] font-bold tracking-widest rounded-full uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#444748] dark:text-gray-400 uppercase">
              REAL-TIME LOGISTICS & ORDERS
            </p>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#1c1b1b] dark:text-white mt-1">
            Order Tracking & History
          </h1>
        </div>

        {/* Live Tracking Simulator Toggle */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Live Carrier Feed
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {isLiveSimulating ? 'Simulating live checkpoint telemetry...' : 'Click to stream real-time logistics update'}
            </span>
          </div>

          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isLiveSimulating
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSimulating ? 'animate-spin' : ''}`} />
            <span>{isLiveSimulating ? 'Streaming Active' : 'Enable Live Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-3xl border border-black/5 dark:border-white/10">
        
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order # (e.g. LX-90214) or item name..."
            className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white pl-11 pr-4 py-2.5 rounded-2xl text-xs outline-none border border-black/5 dark:border-white/10 focus:border-black dark:focus:border-white shadow-xs transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold px-4 py-2.5 pr-8 rounded-2xl border border-black/5 dark:border-white/10 outline-none cursor-pointer shadow-xs"
            >
              <option>All Orders</option>
              <option>Last 6 Months</option>
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold px-4 py-2.5 pr-8 rounded-2xl border border-black/5 dark:border-white/10 outline-none cursor-pointer shadow-xs"
            >
              <option>All Statuses</option>
              <option>Shipped</option>
              <option>Packed</option>
              <option>Ordered</option>
              <option>Delivered</option>
              <option>Returned</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List / Loading Skeletons */}
      {isPageLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/4"></div>
              <div className="h-20 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl"></div>
              <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/3"></div>
            </div>
          ))}
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-black dark:text-white">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            We couldn't find any orders matching your criteria. Try adjusting your search query or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All Statuses');
              setTimeFilter('All Orders');
            }}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-xs overflow-hidden transition-all hover:border-black/20 dark:hover:border-white/20"
            >
              {/* Order Card Header */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/40 border-b border-black/5 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-black dark:text-white">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.overallStatus)}
                  <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                    • Placed on {order.date}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Total: </span>
                    <strong className="text-black dark:text-white font-bold">${order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <span className="text-gray-300 dark:text-zinc-700">|</span>
                  <div className="text-gray-500 text-[11px] hidden md:block">
                    <MapPin className="w-3 h-3 inline mr-1 text-gray-400" />
                    {order.shippingAddress}
                  </div>
                </div>
              </div>

              {/* Order Individual Items & Real-Time Tracking Progress */}
              <div className="p-6 space-y-8">
                {order.items.map((item) => {
                  const currentStepIdx = getStepIndex(item.status);

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-gray-50/60 dark:bg-zinc-800/30 border border-black/5 dark:border-white/5 space-y-6"
                    >
                      {/* Item Details Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={handleImageError}
                            className="w-16 h-16 object-cover rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-2xs"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-black dark:text-white">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.variant} • Qty: {item.quantity}</p>
                            <p className="text-xs font-semibold text-black dark:text-white mt-1">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                          {item.carrier && (
                            <span className="text-[11px] text-gray-500 font-mono bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/10">
                              {item.carrier}
                            </span>
                          )}
                          <button
                            onClick={() => setActiveTrackingItem({ order, item })}
                            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Detailed Telemetry</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* ITEM REAL-TIME TRACKING PROGRESS BAR (Ordered -> Packed -> Shipped -> Delivered) */}
                      {item.status !== 'returned' ? (
                        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">
                              Item Status Progress
                            </span>
                            <span className="text-black dark:text-white flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              {item.estimatedDelivery || 'In Transit'}
                            </span>
                          </div>

                          {/* 4-Step Progress Visualizer */}
                          <div className="relative pt-2">
                            {/* Connecting Progress Line */}
                            <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 dark:bg-zinc-800 -z-0 rounded-full">
                              <div
                                className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    currentStepIdx === 0
                                      ? '0%'
                                      : currentStepIdx === 1
                                      ? '33%'
                                      : currentStepIdx === 2
                                      ? '66%'
                                      : '100%'
                                  }`
                                }}
                              ></div>
                            </div>

                            {/* Step Indicator Nodes */}
                            <div className="relative z-10 flex justify-between items-center text-center">
                              {TRACKING_STEPS.map((step, idx) => {
                                const isCompleted = idx < currentStepIdx;
                                const isCurrent = idx === currentStepIdx;

                                return (
                                  <div key={step.key} className="flex flex-col items-center group">
                                    <div
                                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                                        isCompleted
                                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                                          : isCurrent
                                          ? 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-500/20 scale-110 shadow-md animate-pulse'
                                          : 'bg-white text-gray-400 dark:bg-zinc-900 dark:text-gray-600 border-gray-300 dark:border-zinc-700'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <Check className="w-4 h-4 stroke-[3]" />
                                      ) : (
                                        <span>{idx + 1}</span>
                                      )}
                                    </div>

                                    <div className="mt-2 text-center">
                                      <p
                                        className={`text-xs font-bold ${
                                          isCurrent
                                            ? 'text-black dark:text-white font-extrabold'
                                            : isCompleted
                                            ? 'text-gray-800 dark:text-gray-200'
                                            : 'text-gray-400 dark:text-gray-600'
                                        }`}
                                      >
                                        {step.label}
                                      </p>
                                      <p className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">
                                        {step.desc}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          <span>This item was returned and refunded to your original payment method.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls & Lazy Loading Footer */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-black/5 dark:border-white/10 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)}–
              {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-gray-400">Show per page:</span>
              {[3, 5, 10].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    pageSize === size
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 rounded-xl transition-all ${
                  currentPage === i + 1
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DETAILED LOGISTICS TELEMETRY MODAL / DRAWER */}
      {activeTrackingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div
            onClick={() => setActiveTrackingItem(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          ></div>

          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl z-10 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  LIVE TELEMETRY & CHECKPOINTS
                </span>
                <h3 className="text-xl font-bold font-serif text-black dark:text-white mt-0.5">
                  {activeTrackingItem.item.name}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Order #{activeTrackingItem.order.orderNumber} • Tracking: {activeTrackingItem.item.trackingNumber}
                </p>
              </div>

              <button
                onClick={() => setActiveTrackingItem(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Carrier & Delivery Info Card */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 font-semibold">Carrier Service</p>
                <p className="text-sm font-bold text-black dark:text-white">{activeTrackingItem.item.carrier}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">Estimated Arrival</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {activeTrackingItem.item.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Timeline Checkpoints */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Logistics Event Timeline
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 dark:border-zinc-800 ml-3">
                {activeTrackingItem.item.checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative group">
                    {/* Node */}
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                        cp.completed
                          ? 'bg-black border-black dark:bg-white dark:border-white'
                          : 'bg-white border-gray-300 dark:bg-zinc-900 dark:border-zinc-700'
                      }`}
                    ></div>

                    <div>
                      <div className="flex justify-between items-center">
                        <h5
                          className={`text-sm font-bold ${
                            cp.completed ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {cp.title}
                        </h5>
                        <span className="text-[11px] font-mono text-gray-400">{cp.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{cp.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setActiveTrackingItem(null)}
                className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

