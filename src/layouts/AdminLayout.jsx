import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import './AdminLayout.css';
import adminBookingService from '../services/adminBookingService';
import BookingDetailDrawer from '../components/admin/BookingDetailDrawer';
import { toast } from 'react-hot-toast';
import { getCustomers } from '../services/adminCustomerService';
import { signalRService } from '../services/signalrService';

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 SVG NAVIGATION ICONS
// ─────────────────────────────────────────────────────────────────────────────
function OverviewIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function BookingIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// Sidebar Car Icon representing Services
function ServicesIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M13 17H9" />
    </svg>
  );
}

// Sidebar Tag Icon representing Promotions
function PromotionsIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z" />
      <circle cx="5" cy="5" r="1" />
    </svg>
  );
}

// Sidebar Star Badge representing Tiers Configuration
function TiersIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 8 13.9 11.9 18.2 12.5 15.1 15.6 15.8 19.9 12 17.9 8.2 19.9 8.9 15.6 5.8 12.5 10.1 11.9" />
    </svg>
  );
}

function CustomersIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ReportsIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function BellIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function formatTimeAgo(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diffMs = now - date;
  if (diffMs < 0) return "Vừa xong";
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const user = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [reportsOpen, setReportsOpen] = useState(() =>
    location.pathname.startsWith('/admin/reports')
  );

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('autowash_admin_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const prevBookingsRef = useRef({});
  const prevCustomersRef = useRef({});
  const isFirstFetchRef = useRef(true);
  const dropdownRef = useRef(null);

  const fetchBookingsAndCheckUpdates = async () => {
    try {
      const res = await adminBookingService.getAll({ pageSize: 1000 });
      const rawList = res.data?.data || res.data || [];

      const newBookingsMap = {};
      const newNotifications = [];

      rawList.forEach(b => {
        const id = b.bookingID ?? b.bookingId ?? b.id;
        const status = b.status ?? 'Pending';
        const customerName = b.customerName ?? b.phone ?? 'Khách';
        const licensePlate = b.licensePlate ?? 'Chưa cập nhật';
        const serviceName = b.serviceName ?? 'Dịch vụ';

        newBookingsMap[id] = { status, customerName, licensePlate, serviceName };

        if (!isFirstFetchRef.current) {
          const prev = prevBookingsRef.current[id];
          if (!prev) {
            // New booking
            const notif = {
              id: `new-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              bookingId: id,
              title: "Lịch đặt mới! 📅",
              description: `Khách hàng ${customerName} (${licensePlate}) đã đặt lịch mới cho dịch vụ ${serviceName}.`,
              time: new Date().toISOString(),
              type: 'NEW_BOOKING',
              read: false
            };
            newNotifications.push(notif);
            toast.success(`Lịch đặt mới từ ${customerName}!`, { icon: '📅', duration: 4000 });
          } else if (prev.status !== status) {
            // Status changed
            const notif = {
              id: `status-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              bookingId: id,
              title: "Cập nhật trạng thái lịch đặt 🔄",
              description: `Đơn đặt lịch của ${customerName} (${licensePlate}) đã chuyển trạng thái từ "${prev.status}" sang "${status}".`,
              time: new Date().toISOString(),
              type: 'STATUS_UPDATE',
              read: false
            };
            newNotifications.push(notif);
            toast.info(`Đơn đặt lịch đổi trạng thái sang: ${status}`, { icon: '🔄', duration: 4000 });
          }
        }
      });

      // Update refs
      prevBookingsRef.current = newBookingsMap;

      // 2. Fetch customers to detect new registrations
      try {
        const customerRes = await getCustomers({ page: 1 });
        const rawCustomers = customerRes.data || customerRes || [];

        const newCustomersMap = {};
        rawCustomers.forEach(c => {
          const cid = c.customerID ?? c.customerId ?? c.id;
          const fullName = c.fullName ?? 'Khách hàng';
          const phone = c.phone ?? '';
          newCustomersMap[cid] = { fullName, phone };

          if (!isFirstFetchRef.current) {
            const prevCust = prevCustomersRef.current[cid];
            if (!prevCust) {
              // New customer registered!
              const notif = {
                id: `cust-${cid}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                customerId: cid,
                title: "Khách hàng mới đăng ký! 👤",
                description: `Khách hàng ${fullName} (${phone}) vừa tạo tài khoản thành viên mới.`,
                time: new Date().toISOString(),
                type: 'NEW_CUSTOMER',
                read: false
              };
              newNotifications.push(notif);
              toast.success(`Khách hàng mới đăng ký: ${fullName}!`, { icon: '👤', duration: 4000 });
            }
          }
        });
        prevCustomersRef.current = newCustomersMap;
      } catch (custErr) {
        console.error("Lỗi khi kiểm tra khách hàng mới:", custErr);
      }

      if (isFirstFetchRef.current) {
        isFirstFetchRef.current = false;
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const updated = [...newNotifications, ...prev].slice(0, 100);
          localStorage.setItem('autowash_admin_notifications', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra lịch đặt:", err);
    }
  };

  const handleAdminActionSuccess = (bookingId, actionType, details) => {
    let actionTitle = "Thao tác thành công";
    let actionDesc = `Thao tác thành công trên đơn đặt lịch #${bookingId}`;

    switch (actionType) {
      case "UPDATE_PLATE":
        actionTitle = "Cập nhật biển số thành công 🚗";
        actionDesc = `Đã cập nhật biển số xe mới thành "${details}" cho đơn đặt lịch #${bookingId}`;
        break;
      case "CHECKIN":
        actionTitle = "Ghi nhận xe đến (Check-in) thành công ✓";
        actionDesc = `Giao nhận xe đã được ghi nhận check-in thành công cho đơn đặt lịch #${bookingId}`;
        break;
      case "UPDATE_STATUS":
        actionTitle = "Cập nhật trạng thái thành công 🔄";
        actionDesc = `Trạng thái đơn đặt lịch #${bookingId} đã được cập nhật thành "${details}"`;
        break;
      case "PAYMENT":
        actionTitle = "Ghi nhận thanh toán thành công 💳";
        actionDesc = `Hóa đơn đơn đặt lịch #${bookingId} đã được thanh toán bằng "${details === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}"`;
        break;
      case "EMERGENCY_STOP":
        actionTitle = "Đã kích hoạt dừng khẩn cấp 🚨";
        actionDesc = `Đã kích hoạt dừng khẩn cấp máy rửa xe cho đơn đặt lịch #${bookingId}`;
        break;
      default:
        break;
    }

    const notif = {
      id: `admin-${bookingId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookingId,
      title: actionTitle,
      description: actionDesc,
      time: new Date().toISOString(),
      type: 'ADMIN_UPDATE',
      read: true
    };

    setNotifications(prev => {
      const updated = [notif, ...prev].slice(0, 100);
      localStorage.setItem('autowash_admin_notifications', JSON.stringify(updated));
      return updated;
    });

    fetchBookingsAndCheckUpdates();
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token || user?.role?.toUpperCase() !== "ADMIN") return;

    // Khởi động kết nối SignalR
    signalRService.startConnection();

    // Lắng nghe sự kiện từ Hub
    const unsubscribe = signalRService.registerListener((event, data) => {
      const now = new Date().toISOString();
      const newNotifications = [];

      if (event === "NewBooking") {
        const notif = {
          id: `new-${data.bookingId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookingId: data.bookingId,
          title: "Lịch đặt mới! 📅",
          description: `Khách hàng ${data.customerName} (${data.licensePlate}) đã đặt lịch mới cho dịch vụ ${data.serviceName}.`,
          time: now,
          type: 'NEW_BOOKING',
          read: false
        };
        newNotifications.push(notif);
        toast.success(`Lịch đặt mới từ ${data.customerName}!`, { icon: '📅', duration: 4000 });
      } else if (event === "BookingStatusChanged") {
        const notif = {
          id: `status-${data.bookingId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookingId: data.bookingId,
          title: "Cập nhật trạng thái lịch đặt 🔄",
          description: `Đơn đặt lịch của ${data.customerName} (${data.licensePlate}) đã chuyển trạng thái từ "${data.oldStatus}" sang "${data.newStatus}".`,
          time: now,
          type: 'STATUS_UPDATE',
          read: false
        };
        newNotifications.push(notif);
        toast.info(`Đơn đặt lịch đổi trạng thái sang: ${data.newStatus}`, { icon: '🔄', duration: 4000 });
      } else if (event === "NewCustomer") {
        const notif = {
          id: `cust-${data.customerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId: data.customerId,
          title: "Khách hàng mới đăng ký! 👤",
          description: `Khách hàng ${data.fullName} (${data.phone}) vừa tạo tài khoản thành viên mới.`,
          time: now,
          type: 'NEW_CUSTOMER',
          read: false
        };
        newNotifications.push(notif);
        toast.success(`Khách hàng mới đăng ký: ${data.fullName}!`, { icon: '👤', duration: 4000 });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const updated = [...newNotifications, ...prev].slice(0, 100);
          localStorage.setItem('autowash_admin_notifications', JSON.stringify(updated));
          return updated;
        });

        // Phát sự kiện nội bộ cho các component con (như trang Lịch khách hàng) tự làm mới dữ liệu
        window.dispatchEvent(new Event("autowash_data_updated"));
      }
    });

    // Chạy tải dữ liệu ban đầu để đồng bộ refs
    fetchBookingsAndCheckUpdates();

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('autowash_admin_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('autowash_admin_notifications');
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, read: true } : n);
      localStorage.setItem('autowash_admin_notifications', JSON.stringify(updated));
      return updated;
    });
    if (notif.type === 'NEW_CUSTOMER') {
      navigate(`/admin/customers/${notif.customerId}`);
    } else {
      setSelectedBooking({ id: notif.bookingId });
    }
    setIsBellOpen(false);
  };

  useEffect(() => {
    if (location.pathname.startsWith('/admin/reports')) {
      setReportsOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    signalRService.stopConnection();
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: OverviewIcon },
    { label: 'Lịch khách hàng', path: '/admin/bookings', icon: BookingIcon },
    { label: 'Khách hàng', path: '/admin/customers', icon: CustomersIcon },
    { label: 'Dịch vụ', path: '/admin/services', icon: ServicesIcon },
    { label: 'Khuyến mãi', path: '/admin/promotions', icon: PromotionsIcon },
    { label: 'Cấu hình hạng', path: '/admin/tiers', icon: TiersIcon },
  ];

  const reportSubItems = [
    { label: 'Tổng quan & RFM', path: '/admin/reports' },
    { label: 'Dịch vụ phổ biến', path: '/admin/reports/services' },
    { label: 'Khung giờ cao điểm', path: '/admin/reports/occupancy' },
    { label: 'Hiệu quả khuyến mãi', path: '/admin/reports/promotions' },
  ];


  return (
    <div className="h-screen bg-[#F0F3FF] text-[#111C2C] flex font-sans overflow-hidden">

      {/* Sidebar Panel - Fixed overlay on mobile, sticky flex column on desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 admin-sidebar transition-all duration-300 transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${sidebarOpen
        ? 'translate-x-0 desktop-open'
        : '-translate-x-full desktop-closed'
        } flex flex-col shrink-0`}>

        {/* Logo */}
        <div className="sidebar-logo-container gap-3 shrink-0">
          <Link to="/admin" className="flex items-center gap-3 no-underline">
            <span className="text-cyan-400 text-xl">⟡</span>
            <span className="sidebar-logo-text">
              AUTOWASH PRO
            </span>
          </Link>
        </div>

        {/* User Profile - Top aligned */}
        <div className="sidebar-user-container shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.fullName || 'Alex Turner'}</p>
              <p className="text-xs sidebar-user-role mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-grow sidebar-nav-container space-y-1.5 overflow-y-auto">
          <div className="sidebar-nav-label">
            MENU
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Reports Collapsible Dropdown */}
          <div className="reports-dropdown-section">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`sidebar-nav-item w-full text-left justify-between cursor-pointer ${location.pathname.startsWith('/admin/reports') ? 'active' : ''
                }`}
            >
              <div className="flex items-center gap-[14px]">
                <ReportsIcon className="w-5 h-5 shrink-0" />
                <span>Báo cáo & Phân tích</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 shrink-0 ${reportsOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {reportsOpen && (
              <div className="sidebar-subnav-container space-y-1 mt-1">
                {reportSubItems.map((subItem) => {
                  const isSubActive = location.pathname === subItem.path;
                  return (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                      className={`sidebar-subnav-item ${isSubActive ? 'active' : ''}`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>


        {/* Bottom Section */}
        <div className="sidebar-bottom-container space-y-1 shrink-0">
          <button className="sidebar-bottom-item">
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Help Center</span>
          </button>

          <button
            onClick={handleLogout}
            className="sidebar-bottom-item logout"
          >
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Side - Flex column layout */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 bg-white/85 backdrop-blur-md border-b border-[#BCC8CE] px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 focus:outline-none cursor-pointer flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all"
              title="Toggle Sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-[#111C2C] tracking-tight">
              {location.pathname === '/admin/dashboard'
                ? 'Tổng quan'
                : (navItems.find((item) =>
                  location.pathname === item.path ||
                  (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'))
                )?.label || reportSubItems.find((subItem) => location.pathname === subItem.path)?.label || 'Dashboard')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#3D494D] font-medium">
              <span>Server: <span className="text-[#34C759] font-bold">• Online</span></span>
            </div>
            {/* Bell Icon with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="w-10 h-10 bg-[#E7EEFF] hover:bg-[#d8e3fa] text-[#3D494D] hover:text-[#111c2c] rounded-full flex items-center justify-center transition-all relative cursor-pointer shadow-sm"
              >
                <BellIcon className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B30] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {isBellOpen && (
                <div
                  className="bg-white border border-[#BCC8CE] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-sm"
                  style={{ position: 'absolute', right: 0, left: 'auto', top: '100%', marginTop: '12px', width: '320px', zIndex: 9999 }}
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
                    <span className="font-bold text-[#111C2C] flex items-center gap-1.5">
                      <span>Thông báo</span>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#E7EEFF] text-cyan-600 text-[10px] font-bold rounded-md">
                          {notifications.filter(n => !n.read).length} mới
                        </span>
                      )}
                    </span>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold cursor-pointer"
                        >
                          Đọc hết
                        </button>
                        <span className="text-slate-350">|</span>
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Xóa tất cả
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown List */}
                  <div className="max-h-84 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                          <BellIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">Không có thông báo nào</span>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3.5 items-start relative ${!notif.read ? 'bg-cyan-50/20' : ''
                            }`}
                        >
                          {/* Unread indicator */}
                          {!notif.read && (
                            <span className="absolute top-4.5 left-2 w-2 h-2 bg-cyan-500 rounded-full" />
                          )}

                          {/* Icon wrapper */}
                          <div className={`p-2 rounded-xl shrink-0 ${notif.type === 'NEW_BOOKING'
                              ? 'bg-emerald-50 text-emerald-600'
                              : notif.type === 'NEW_CUSTOMER'
                                ? 'bg-amber-50 text-amber-600'
                                : notif.type === 'ADMIN_UPDATE'
                                  ? 'bg-purple-50 text-purple-600'
                                  : 'bg-blue-50 text-blue-600'
                            }`}>
                            {notif.type === 'NEW_BOOKING' ? (
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            ) : notif.type === 'NEW_CUSTOMER' ? (
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : notif.type === 'ADMIN_UPDATE' ? (
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            ) : (
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.2 8H18.7" />
                              </svg>
                            )}
                          </div>

                          {/* Text info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-xs truncate leading-snug">{notif.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{notif.description}</p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {formatTimeAgo(notif.time)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={(id, act, det) => handleAdminActionSuccess(id, act, det)}
      />

      {/* Sidebar Backdrop on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
}
