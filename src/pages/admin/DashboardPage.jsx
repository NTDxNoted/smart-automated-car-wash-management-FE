import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import adminBookingService from '../../services/adminBookingService';
import { getTierDistribution, getLoyaltyStats } from '../../services/adminReportService';
import { getCustomers } from '../../services/adminCustomerService';
import BookingDetailDrawer from '../../components/admin/BookingDetailDrawer';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import './DashboardPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 SVG ICON COMPONENTS (Self-contained, no external package required)
// ─────────────────────────────────────────────────────────────────────────────
function BriefcaseIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AlertTriangleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function TrendingUpIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎛️ CUSTOM METRIC CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MetricCard({ title, value, subtitle, trend, icon: Icon, type, onClick }) {
  const isWarning = type === 'no-shows';
  return (
    <div className={`metric-card-custom ${type} ${onClick ? 'cursor-pointer animate-fade-in' : ''}`} onClick={onClick}>
      <div className="card-overlay-blur" />
      <div className="card-content-wrapper">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#3D494D] uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-extrabold text-[#111C2C] mt-2.5 tracking-tighter" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{value}</p>
          </div>
          <div className="metric-icon-bg">
            <Icon className="w-5.5 h-5.5" />
          </div>
        </div>

        {subtitle && (
          <p className="text-[11px] font-bold tracking-wider text-[#4E5F7C] mt-auto uppercase" style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '0.6px' }}>{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-auto">
            <span className="text-[11px] font-bold text-[#00677F] tracking-wider flex items-center gap-1 uppercase" style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '0.6px' }}>
              <svg className="w-3 h-3 text-[#00677F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend}
            </span>
          </div>
        )}
        {isWarning && (
          <div className="mt-auto flex items-center gap-1 text-[#BA1A1A] text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '0.6px' }}>
            <AlertTriangleIcon className="w-3.5 h-3.5 text-[#BA1A1A]" />
            <span>Cần theo dõi</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📈 MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [bookingsToday, setBookingsToday] = useState(0);
  const [revenueTodayStr, setRevenueTodayStr] = useState('0đ');
  const [pendingCount, setPendingCount] = useState(0);
  const [noShowCount, setNoShowCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);

  const [processingCars, setProcessingCars] = useState([]);
  const [waitingCars, setWaitingCars] = useState([]);
  const [needCheckinCars, setNeedCheckinCars] = useState([]);

  const [warnings, setWarnings] = useState([]);

  const [customerTierMap, setCustomerTierMap] = useState({});
  const [tierData, setTierData] = useState([
    { tier: "Member", total: 0 },
    { tier: "Silver", total: 0 },
    { tier: "Gold", total: 0 },
    { tier: "Platinum", total: 0 },
  ]);
  const [loyaltyStats, setLoyaltyStats] = useState({
    totalPoints: 0,
    expiringSoon: 0,
    expired: 0,
  });
  const [chartData, setChartData] = useState([
    { day: 'T2', revenue: 0 },
    { day: 'T3', revenue: 0 },
    { day: 'T4', revenue: 0 },
    { day: 'T5', revenue: 0 },
    { day: 'T6', revenue: 0 },
    { day: 'T7', revenue: 0 },
    { day: 'CN', revenue: 0 },
  ]);
  const [recentBookings, setRecentBookings] = useState([]);

  const fetchStats = async () => {
    try {
      let localTierMap = {};
      try {
        const [tierRes, loyaltyRes, custRes] = await Promise.all([
          getTierDistribution(),
          getLoyaltyStats(),
          getCustomers({ page: 1, pageSize: 1000 }),
        ]);
        if (tierRes) setTierData(tierRes);
        if (loyaltyRes) setLoyaltyStats(loyaltyRes);
        
        const rawCusts = custRes.data || custRes || [];
        rawCusts.forEach(c => {
          const nameKey = c.fullName?.toLowerCase().trim();
          const phoneKey = c.phone?.trim();
          if (nameKey) localTierMap[nameKey] = c.tier || 'Member';
          if (phoneKey) localTierMap[phoneKey] = c.tier || 'Member';
        });
        setCustomerTierMap(localTierMap);
      } catch (loyaltyErr) {
        console.error("Lỗi tải thông tin Loyalty trong Dashboard:", loyaltyErr);
      }

      const res = await adminBookingService.getAll({ pageSize: 1000 });
      const list = res.data?.data || res.data || [];
      if (list.length > 0) {
        const todayDateStr = new Date().toLocaleDateString('en-CA');
        const now = new Date();

        let bToday = 0;
        let rToday = 0;
        let pCount = 0;
        let nsCount = 0;
        let prCount = 0;

        // LPR Lists
        const procList = [];
        const waitList = [];
        const nCheckinList = [];

        // Operational warnings lists
        const warningList = [];

        // Aggregation for the past 7 calendar days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-CA');
          const dayLabel = d.toLocaleDateString('vi-VN', { weekday: 'short' });
          last7Days.push({
            dateStr,
            day: dayLabel.replace('Th ', 'T').replace('Thứ ', 'T'),
            revenue: 0,
          });
        }

        list.forEach(b => {
          const bStatus = b.status?.toUpperCase();
          const bDateStr = b.scheduledTime ? new Date(b.scheduledTime).toLocaleDateString('en-CA') : '';
          const isBToday = bDateStr === todayDateStr;
          const bTime = b.scheduledTime ? new Date(b.scheduledTime) : null;

          const customerName = b.customerName ?? b.phone ?? 'Khách hàng';
          const nameKey = customerName.toLowerCase().trim();
          const phoneKey = b.phone?.trim();
          const tier = b.tier || b.customerTier || localTierMap[nameKey] || (phoneKey ? localTierMap[phoneKey] : null) || 'Member';

          const mappedObj = {
            id: b.bookingID ?? b.bookingId ?? b.id,
            customer: customerName,
            plate: b.licensePlate || '-',
            service: b.serviceName || 'Rửa Xe',
            status: b.status || 'Pending',
            tier: tier,
            scheduledTime: b.scheduledTime
          };

          if (isBToday) {
            bToday++;
            
            // 1. Doanh thu hôm nay: chỉ tính COMPLETED
            if (bStatus === 'COMPLETED') {
              rToday += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? 0);
            }

            // 2. Trạng thái tức thời
            if (bStatus === 'PENDING') {
              pCount++;
              const checkinTimeVal = b.checkInTime || b.checkinTime || b.CheckInTime;
              if (checkinTimeVal) {
                waitList.push(mappedObj);
              } else {
                nCheckinList.push(mappedObj);
              }
            }

            if (bStatus === 'PROCESSING' || bStatus === 'IN-PROGRESS' || bStatus === 'IN_PROGRESS') {
              prCount++;
              procList.push(mappedObj);
            }

            if (bStatus === 'NOSHOW' || bStatus === 'NO-SHOW' || bStatus === 'NO_SHOW') {
              nsCount++;
            }

            // 3. Cảnh báo vận hành
            // a. No-show
            if (bStatus === 'NOSHOW' || bStatus === 'NO-SHOW' || bStatus === 'NO_SHOW') {
              warningList.push({
                type: 'NOSHOW',
                message: `Khách hàng ${customerName} (${mappedObj.plate}) không đến hẹn (No-show)`,
                detail: `Lịch hẹn lúc ${bTime ? bTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Hôm nay'}`,
                booking: mappedObj
              });
            }
            // b. Booking Pending quá lâu (> 30 phút so với giờ đặt)
            if (bStatus === 'PENDING') {
              if (bTime && (now - bTime) / 60000 > 30) {
                warningList.push({
                  type: 'PENDING_TOO_LONG',
                  message: `Lịch hẹn của ${customerName} đang bị trễ quá 30 phút`,
                  detail: `Lịch đặt: ${bTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (Trễ ${Math.floor((now - bTime) / 60000)} phút)`,
                  booking: mappedObj
                });
              }
            }
            // c. Chưa có biển số xe
            if ((bStatus === 'PENDING' || bStatus === 'PROCESSING') && (!b.licensePlate || b.licensePlate.trim() === '-' || b.licensePlate.toLowerCase().includes('chưa'))) {
              warningList.push({
                type: 'NO_PLATE',
                message: `Xe của khách hàng ${customerName} chưa cập nhật biển số`,
                detail: `Trạng thái: ${bStatus === 'PENDING' ? 'Đang chờ' : 'Đang xử lý'}`,
                booking: mappedObj
              });
            }
            // d. Booking failed/cancelled
            if (['FAILED', 'CANCELLED', 'CANCEL', 'CANCEL_BY_ADMIN', 'CANCEL_BY_CUSTOMER'].includes(bStatus)) {
              warningList.push({
                type: 'FAILED_CANCEL',
                message: `Lịch đặt của ${customerName} bị hủy hoặc thất bại`,
                detail: `Lý do/Trạng thái: ${bStatus === 'FAILED' ? 'Thất bại' : 'Bị hủy'}`,
                booking: mappedObj
              });
            }
          }

          // Aggregate weekly revenue
          if (bStatus === 'COMPLETED') {
            const dayBucket = last7Days.find(item => item.dateStr === bDateStr);
            if (dayBucket) {
              dayBucket.revenue += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? 0);
            }
          }
        });

        // Set dynamic counters
        setBookingsToday(bToday);
        setPendingCount(pCount);
        setNoShowCount(nsCount);
        setProcessingCount(prCount);
        
        setProcessingCars(procList);
        setWaitingCars(waitList);
        setNeedCheckinCars(nCheckinList);
        setWarnings(warningList);

        let formattedRevenue = rToday >= 1000000
          ? `${(rToday / 1000000).toFixed(1)}M`
          : `${rToday.toLocaleString()}đ`;
        setRevenueTodayStr(formattedRevenue);

        // Update chart dataset
        setChartData(last7Days.map(item => ({
          day: item.day,
          revenue: Number((item.revenue / 1000000).toFixed(2)),
        })));

        // Top 5 sorted bookings
        const sortedList = [...list].sort((a, b) => new Date(b.scheduledTime || b.createdAt) - new Date(a.scheduledTime || a.createdAt));
        const top5 = sortedList.slice(0, 5).map(b => {
          const customerName = b.customerName ?? b.phone ?? 'Khách hàng';
          const nameKey = customerName.toLowerCase().trim();
          const phoneKey = b.phone?.trim();
          const tier = b.tier || b.customerTier || localTierMap[nameKey] || (phoneKey ? localTierMap[phoneKey] : null) || 'Member';
          return {
            id: b.bookingID ?? b.bookingId ?? b.id,
            customer: customerName,
            plate: b.licensePlate || '-',
            service: b.serviceName || 'Rửa Xe',
            status: b.status || 'Pending',
            tier: tier
          };
        });
        if (top5.length > 0) {
          setRecentBookings(top5);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleLprCheckin = async (id) => {
    try {
      await adminBookingService.checkin(id);
      toast.success("Check-in xe thành công!");
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      toast.error("Không thể ghi nhận check-in");
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const renderAvatar = (customer) => {
    let bgClass = "bg-[#C9DBFD] text-[#4F607D]"; // default (e.g. NL, VT)
    if (customer === 'Hoang Anh' || customer === 'Tran Minh') {
      bgClass = "bg-[#00A9CE] text-white";
    }

    return (
      <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0`}>
        {getInitials(customer)}
      </div>
    );
  };

  const formatBookingId = (id) => {
    if (!id) return '#AW-0000';
    const cleanId = String(id).replace(/[^a-zA-Z0-9]/g, '');
    if (cleanId.length > 4) {
      return `#AW-${cleanId.slice(-4).toUpperCase()}`;
    }
    return `#AW-${cleanId.toUpperCase()}`;
  };

  const getStatusBadge = (status) => {
    const normStatus = status?.toUpperCase();
    switch (normStatus) {
      case 'COMPLETED':
        return (
          <span className="status-badge-figma completed">
            <span className="status-dot"></span>
            <span className="status-text">Đã xong</span>
          </span>
        );
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return (
          <span className="status-badge-figma processing">
            <span className="status-dot"></span>
            <span className="status-text">Đang rửa</span>
          </span>
        );
      case 'CANCELLED':
      case 'CANCEL':
      case 'CANCEL_BY_ADMIN':
      case 'CANCEL_BY_CUSTOMER':
      case 'FAILED':
        return (
          <span className="status-badge-figma cancelled">
            <span className="status-dot"></span>
            <span className="status-text">Đã hủy</span>
          </span>
        );
      case 'NOSHOW':
      case 'NO-SHOW':
        return (
          <span className="status-badge-figma completed">
            <span className="status-dot bg-slate-400"></span>
            <span className="status-text text-slate-500">No-show</span>
          </span>
        );
      default:
        return (
          <span className="status-badge-figma completed">
            <span className="status-dot bg-amber-500 animate-pulse"></span>
            <span className="status-text text-amber-700">Đang chờ</span>
          </span>
        );
    }
  };

  const maxRevenueItem = chartData.reduce((prev, curr) => (curr.revenue > prev.revenue) ? curr : prev, chartData[0]) || { day: 'CN', revenue: 0 };

  return (
    <div className="dashboard-container">
      <div className="dashboard-page-subtitle"></div>
      
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <MetricCard
          title="Doanh thu hôm nay"
          value={revenueTodayStr}
          trend="+8.2% vs hôm qua"
          icon={BriefcaseIcon}
          type="revenue"
          onClick={() => navigate('/admin/bookings')}
        />
        <MetricCard
          title="Booking hôm nay"
          value={bookingsToday.toString()}
          subtitle={`${processingCount} xe đang rửa`}
          icon={CalendarIcon}
          type="bookings"
          onClick={() => navigate(`/admin/bookings?date=${new Date().toLocaleDateString('en-CA')}`)}
        />
        <MetricCard
          title="Dịch vụ đang chờ"
          value={pendingCount.toString()}
          subtitle="Chờ check-in hoặc rửa"
          icon={ClockIcon}
          type="services"
          onClick={() => navigate('/admin/bookings?status=PENDING')}
        />
        <MetricCard
          title="Khách không đến (No-show)"
          value={noShowCount.toString()}
          icon={AlertTriangleIcon}
          type="no-shows"
          onClick={() => navigate('/admin/bookings?status=NOSHOW')}
        />
      </div>

      {/* Main Charts & Side panel Section */}
      <div className="dashboard-grid">
        
        {/* Weekly Revenue & Tier Distribution */}
        <div className="chart-section dashboard-card flex flex-col justify-between" style={{ gridColumn: "span 2" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* Weekly Revenue */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[#111C2C] font-bold text-base" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    Doanh thu 7 ngày qua
                  </h3>
                  <p className="text-[#3D494D] text-xs">
                    Tổng quan hiệu suất vận hành 7 ngày gần nhất
                  </p>
                </div>
              </div>

              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00677F" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00677F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(188, 200, 206, 0.2)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#6D797E"
                      tick={{ fontSize: 10, fill: '#6D797E' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6D797E"
                      tick={{ fontSize: 10, fill: '#6D797E' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `${val}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#263142',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#EBF1FF',
                        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      itemStyle={{ color: '#00A9CE' }}
                      labelStyle={{ color: '#EBF1FF', fontWeight: 'bold' }}
                      formatter={(value) => [`${value}M`, 'Doanh thu']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00677F"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      dot={{ fill: '#F9F9FF', stroke: '#00677F', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, strokeWidth: 0, fill: '#00677F' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                Cao nhất: <span className="font-bold text-[#00677F]">{maxRevenueItem.revenue}M</span> ({maxRevenueItem.day})
              </div>
            </div>

            {/* Tier Distribution Pie Chart */}
            <div className="flex flex-col justify-between border-l border-[#BCC8CE]/20 pl-4">
              <div className="mb-4">
                <h3 className="text-[#111C2C] font-bold text-base" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  Phân bổ hạng thành viên
                </h3>
                <p className="text-[#3D494D] text-xs">
                  Cơ cấu hạng loyalty khách hàng
                </p>
              </div>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierData.map(t => ({
                        name: t.tier ?? t.tierName ?? t.name,
                        value: t.total ?? t.count ?? 0
                      }))}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {tierData.map((entry, index) => {
                        const colors = ['#00677F', '#00A9CE', '#949D9E', '#C9DBFD'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#263142',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#EBF1FF',
                      }}
                    />
                    <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Queue Panels & Warnings */}
        <div className="flex flex-col gap-6">
          
          {/* LPR Queue */}
          <div className="dashboard-card space-y-4" style={{ minHeight: 'unset', padding: '20px' }}>
            <h4 className="text-[#111C2C] font-bold text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Buồng Rửa Tự Động (LPR Queue)
            </h4>
            <div className="space-y-3">
              {/* Đang xử lý */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Đang xử lý</span>
                  {processingCars.length > 0 && <span className="text-[10px] text-emerald-500 animate-pulse">● Đang chạy</span>}
                </div>
                {processingCars.length === 0 ? (
                  <div className="text-xs text-slate-400 mt-1 italic">Không có xe đang rửa</div>
                ) : (
                  processingCars.map(car => (
                    <div key={car.id} className="mt-1 cursor-pointer" onClick={() => setSelectedBooking(car)}>
                      <div className="text-base font-extrabold text-[#111C2C] flex items-center justify-between">
                        <span>{car.plate}</span>
                        <span className="text-xs font-normal text-slate-500">{car.customer}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Dịch vụ: {car.service}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Đang chờ */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <span className="text-[9px] font-bold uppercase text-blue-600 block mb-1.5">Xe đang chờ rửa ({waitingCars.length})</span>
                {waitingCars.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Không có xe đang chờ</div>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {waitingCars.map((car, idx) => (
                      <div key={car.id} className="flex items-center justify-between text-xs cursor-pointer hover:bg-blue-100/30 p-1 rounded" onClick={() => setSelectedBooking(car)}>
                        <span className="font-semibold text-slate-700">{idx + 1}. {car.plate}</span>
                        <span className={`rfm-tier-badge ${car.tier?.toLowerCase()}`} style={{ fontSize: '8px', padding: '1px 4px' }}>{car.tier}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cần check-in */}
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <span className="text-[9px] font-bold uppercase text-amber-600 block mb-1.5">Chưa Check-in ({needCheckinCars.length})</span>
                {needCheckinCars.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Hôm nay không còn lịch chưa check-in</div>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {needCheckinCars.map((car) => (
                      <div key={car.id} className="flex items-center justify-between text-xs p-1 hover:bg-amber-100/30 rounded">
                        <div className="flex flex-col cursor-pointer" onClick={() => setSelectedBooking(car)}>
                          <span className="font-semibold text-slate-700">{car.plate !== '-' ? car.plate : 'Biển số: -'}</span>
                          <span className="text-[9px] text-slate-500">{car.customer}</span>
                        </div>
                        <button 
                          onClick={() => handleLprCheckin(car.id)}
                          className="px-2 py-0.5 bg-[#00677F] hover:bg-[#005266] text-white rounded text-[9px] font-bold cursor-pointer transition-all"
                        >
                          Check-in
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loyalty Health */}
          <div className="dashboard-card space-y-4" style={{ minHeight: 'unset', padding: '20px' }}>
            <h4 className="text-[#111C2C] font-bold text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Sức khỏe Loyalty (Loyalty Health)
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Tổng điểm lưu hành:</span>
                <span className="text-xs font-bold text-[#00677F]">{loyaltyStats.totalPoints?.toLocaleString()} đ</span>
              </div>
              <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex justify-between items-center">
                <span className="text-xs text-amber-700 font-medium">Sắp hết hạn (≤ 30 ngày):</span>
                <span className="text-xs font-bold text-amber-700">{loyaltyStats.expiringSoon?.toLocaleString()} đ</span>
              </div>
              <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex justify-between items-center">
                <span className="text-xs text-red-700 font-medium">Đã hết hạn:</span>
                <span className="text-xs font-bold text-red-700">{loyaltyStats.expired?.toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          {/* Cảnh báo cần xử lý */}
          {warnings.length > 0 && (
            <div className="dashboard-card border-[#BA1A1A] bg-[#FFF5F5] space-y-3" style={{ minHeight: 'unset', padding: '20px' }}>
              <h4 className="text-[#BA1A1A] font-bold text-sm flex items-center gap-1.5" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                <AlertTriangleIcon className="w-4 h-4 text-[#BA1A1A] shrink-0" />
                <span>Cảnh báo cần xử lý ({warnings.length})</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {warnings.map((warn, idx) => (
                  <div 
                    key={`${warn.booking?.id || idx}`} 
                    className="p-2.5 bg-white border border-[#FFDAD6] rounded-xl text-xs flex flex-col justify-between gap-1 cursor-pointer hover:border-amber-400 hover:shadow-sm transition-all"
                    onClick={() => setSelectedBooking(warn.booking)}
                  >
                    <div className="font-semibold text-slate-800 leading-snug">{warn.message}</div>
                    <div className="text-[10px] text-slate-500 flex justify-between items-center mt-1">
                      <span>{warn.detail}</span>
                      <span className="text-[#00677F] font-bold hover:underline">Xử lý ngay &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bookings-table-container">
        <div className="bookings-header-row">
          <h3 className="text-[#111C2C] text-lg font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Booking gần đây
          </h3>
          <button className="bookings-view-all-btn" onClick={() => navigate('/admin/bookings')}>
            Xem tất cả
          </button>
        </div>

        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr className="bookings-thead-row">
                <th className="bookings-th code">MÃ ĐƠN</th>
                <th className="bookings-th customer">KHÁCH HÀNG</th>
                <th className="bookings-th plate">BIỂN SỐ XE</th>
                <th className="bookings-th service">DỊCH VỤ</th>
                <th className="bookings-th status">TRẠNG THÁI</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="bookings-tbody-row cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <td className="bookings-td code">
                    {formatBookingId(booking.id)}
                  </td>

                  <td className="bookings-td customer" style={{ display: 'flex', alignItems: 'center', height: '73px' }}>
                    {renderAvatar(booking.customer)}
                    <div className="flex flex-col gap-1 items-start justify-center ml-2.5">
                      <span className="bookings-td customer-name" style={{ padding: 0, fontSize: '13.5px', fontWeight: 600 }}>
                        {booking.customer}
                      </span>
                      <span className={`rfm-tier-badge ${booking.tier?.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px', textTransform: 'uppercase' }}>
                        {booking.tier}
                      </span>
                    </div>
                  </td>

                  <td className="bookings-td plate">
                    {booking.plate}
                  </td>

                  <td className="bookings-td service">
                    {booking.service}
                  </td>

                  <td className="bookings-td status">
                    {getStatusBadge(booking.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={() => {
          setSelectedBooking(null);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

    </div>
  );
}
