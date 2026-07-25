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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import SafeChartContainer from '../../components/common/SafeChartContainer';
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
          getTierDistribution().catch(err => {
            console.error("Lỗi tải phân bổ hạng thành viên:", err);
            return null;
          }),
          getLoyaltyStats().catch(err => {
            console.error("Lỗi tải thống kê Loyalty:", err);
            return null;
          }),
          getCustomers({ page: 1, pageSize: 1000 }).catch(err => {
            console.error("Lỗi tải danh sách khách hàng:", err);
            return null;
          }),
        ]);
        if (tierRes) setTierData(tierRes);
        if (loyaltyRes) setLoyaltyStats(loyaltyRes);

        if (custRes) {
          const rawCusts = custRes.data || custRes || [];
          rawCusts.forEach(c => {
            const nameKey = c.fullName?.toLowerCase().trim();
            const phoneKey = c.phone?.trim();
            if (nameKey) localTierMap[nameKey] = c.tier || 'Member';
            if (phoneKey) localTierMap[phoneKey] = c.tier || 'Member';
          });
          setCustomerTierMap(localTierMap);
        }
      } catch (loyaltyErr) {
        console.error("Lỗi tải thông tin Loyalty trong Dashboard:", loyaltyErr);
      }

      const res = await adminBookingService.getAll({ pageSize: 1000 });
      const list = res.data?.data || res.data || [];
      if (list.length > 0) {
        const today = new Date();
        let targetTodayDate = today;
        const todayDateStr = targetTodayDate.toLocaleDateString('en-CA');
        const now = targetTodayDate;

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

        // Aggregation for the past 7 days ending today
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(targetTodayDate);
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-CA');
          const dayLabel = d.toLocaleDateString('vi-VN', { weekday: 'short' });
          let dayIndex = d.getDay(); // 0 is Sunday, 1 is Monday, etc.
          if (dayIndex === 0) dayIndex = 7; // Map Sunday to 7
          last7Days.push({
            dateStr,
            day: dayLabel.replace('Th ', 'T').replace('Thứ ', 'T'),
            revenue: 0,
            dayIndex,
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
              rToday += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? b.totalPrice ?? 0);
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

            // 3. Cảnh báo vận hành - Chỉ hiển thị khi khách hẹn bị trễ quá 30 phút
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
          }

          // Aggregate weekly revenue
          if (bStatus === 'COMPLETED') {
            const dayBucket = last7Days.find(item => item.dateStr === bDateStr);
            if (dayBucket) {
              dayBucket.revenue += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? b.totalPrice ?? 0);
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

        // Sort last7Days by dayIndex so T2 (Monday, dayIndex=1) is first and CN (Sunday, dayIndex=7) is last
        const sorted7Days = [...last7Days].sort((a, b) => a.dayIndex - b.dayIndex);

        // Update chart dataset
        setChartData(sorted7Days.map(item => ({
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
  const totalCustomers = tierData.reduce((sum, item) => sum + (item.total ?? item.count ?? 0), 0);
  const total7DaysRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const total7DaysRevenueStr = total7DaysRevenue.toFixed(1);

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

        {/* Left Column: Revenue Chart & Member Distribution */}
        <div className="chart-section-wrapper-modern chart-section" style={{ gridColumn: "span 2" }}>

          {/* Revenue Area Chart */}
          <div className="chart-card-revenue-modern">
            <div className="revenue-chart-header">
              <div className="revenue-chart-titles">
                <h4 className="revenue-chart-title">
                  Doanh thu 7 ngày qua
                </h4>
                <div className="revenue-chart-subtitle-container">
                  <span className="revenue-chart-subtitle">
                    Tổng quan hiệu suất vận hành 7 ngày gần nhất
                  </span>
                </div>
              </div>
              <div className="revenue-chart-metrics">
                <div className="revenue-chart-metric-label-container">
                  <span className="revenue-chart-metric-label">
                    Weekly Revenue
                  </span>
                </div>
                <div className="revenue-chart-metric-paragraph">
                  <span className="revenue-chart-metric-value">
                    {total7DaysRevenueStr}
                  </span>
                  <span className="revenue-chart-metric-unit">
                    M
                  </span>
                </div>
              </div>
            </div>

            <div className="revenue-chart-body">
              <div className="revenue-chart-svg-container">
                <SafeChartContainer height={256}>
                  {(width, height) => (
                    <AreaChart width={width} height={height} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenueModern" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#006A61" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#006A61" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="day"
                        stroke="#44474D"
                        tick={{ fontSize: 12, fill: '#44474D', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#44474D"
                        tick={{ fontSize: 10, fill: '#44474D', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
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
                        stroke="#006A61"
                        strokeWidth={2.65624}
                        fillOpacity={1}
                        fill="url(#colorRevenueModern)"
                        dot={{ fill: '#FFFFFF', stroke: '#006A61', strokeWidth: 1.77083, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#006A61' }}
                      />
                    </AreaChart>
                  )}
                </SafeChartContainer>
              </div>
            </div>
          </div>

          {/* Member Distribution Modern View */}
          <div className="chart-card-member-modern">
            <h3 className="font-semibold text-lg text-[#000F24] w-full" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Phân bổ hạng thành viên
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-12 w-full mt-2">
              {/* Left Side: Donut Chart */}
              <div className="relative w-40 h-40 flex-shrink-0 mx-auto md:mx-0">
                {totalCustomers === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-full text-slate-400">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Thành viên</span>
                  </div>
                ) : (
                  <>
                    <SafeChartContainer height={160}>
                      {(width, height) => (
                        <PieChart width={width} height={height}>
                          <Pie
                            data={tierData.map(t => ({
                              name: t.tier ?? t.tierName ?? t.name,
                              value: t.total ?? t.count ?? 0
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {tierData.map((entry, index) => {
                              const name = String(entry.tier ?? entry.tierName ?? entry.name).toUpperCase();
                              let fill = '#00677F';
                              if (name.includes('PLATINUM')) fill = '#FF00FF';
                              else if (name.includes('GOLD')) fill = '#FFD700';
                              else if (name.includes('SILVER')) fill = '#C0C0C0';
                              else if (name.includes('MEMBER')) fill = '#4DC3D6';
                              return <Cell key={`cell-${index}`} fill={fill} />;
                            })}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      )}
                    </SafeChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-[#000F24]" style={{ fontFamily: "'Inter', sans-serif" }}>{totalCustomers}</span>
                      <span className="text-[10px] font-bold text-[#44474D] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Thành viên</span>
                    </div>
                  </>
                )}
              </div>

              {/* Right Side: Legend Bento Style */}
              <div className="grid grid-cols-2 gap-4 flex-grow w-full">
                {(() => {
                  const bentoItems = [
                    { key: 'PLATINUM', label: 'PLATINUM', color: '#FF00FF' },
                    { key: 'GOLD', label: 'GOLD', color: '#FFD700' },
                    { key: 'SILVER', label: 'SILVER', color: '#C0C0C0' },
                    { key: 'MEMBER', label: 'MEMBER', color: '#4DC3D6' }
                  ];

                  return bentoItems.map((item) => {
                    const dataItem = tierData.find(t => String(t.tier ?? t.tierName ?? t.name).toUpperCase().includes(item.key));
                    const count = dataItem ? (dataItem.total ?? dataItem.count ?? 0) : 0;
                    const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;

                    return (
                      <div
                        key={item.key}
                        className="bento-card-modern"
                        style={{ borderLeft: `4px solid ${item.color}` }}
                      >
                        {/* Top Row: Label + Color Dot */}
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold tracking-wider" style={{ color: item.color, fontFamily: "'Inter', sans-serif" }}>
                            {item.label}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        </div>

                        {/* Bottom Row: Count + Percentage */}
                        <div className="flex items-baseline justify-between w-full mt-2">
                          <span className="text-lg font-bold text-[#191C1E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {count}
                          </span>
                          <span className="text-xs font-medium text-[#44474D]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Queue Panels & Warnings */}
        <div className="flex flex-col gap-6">

          {/* LPR Queue - Modernized */}
          <div className="modern-lpr-card">
            <div className="modern-lpr-header">
              <div className="modern-lpr-header-icon-bg">
                <svg className="modern-lpr-header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div className="modern-lpr-header-title-container">
                <h4 className="modern-lpr-header-title">
                  Buồng Rửa Tự Động
                </h4>
                <h5 className="modern-lpr-header-subtitle">
                  LPR Queue
                </h5>
              </div>
            </div>

            <div className="modern-lpr-body">
              {/* Đang xử lý */}
              <div
                className="modern-lpr-item-processing"
                onClick={() => processingCars.length > 0 && setSelectedBooking(processingCars[0])}
                style={{ cursor: processingCars.length > 0 ? 'pointer' : 'default' }}
              >
                <div className="modern-lpr-item-processing-left">
                  <span className="modern-lpr-item-processing-dot"></span>
                  <div className="modern-lpr-item-processing-text-container">
                    <h5 className="modern-lpr-item-processing-title">ĐANG XỬ LÝ</h5>
                    <p className="modern-lpr-item-processing-desc">
                      {processingCars.length > 0 ? `${processingCars[0].plate}${processingCars.length > 1 ? ` (+${processingCars.length - 1})` : ''}` : "Không có xe"}
                    </p>
                  </div>
                </div>
                <div className="modern-lpr-item-processing-badge">
                  <span className="modern-lpr-item-processing-badge-text">
                    {processingCars.length}
                  </span>
                </div>
              </div>

              {/* Đang chờ */}
              <div
                className="modern-lpr-item-waiting"
                onClick={() => waitingCars.length > 0 && setSelectedBooking(waitingCars[0])}
                style={{ cursor: waitingCars.length > 0 ? 'pointer' : 'default' }}
              >
                <div className="modern-lpr-item-waiting-left">
                  <svg className="modern-lpr-item-waiting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div className="modern-lpr-item-waiting-text-container">
                    <h5 className="modern-lpr-item-waiting-title">ĐANG CHỜ RỬA</h5>
                    <p className="modern-lpr-item-waiting-desc">
                      {waitingCars.length > 0 ? `${waitingCars[0].plate}${waitingCars.length > 1 ? ` (+${waitingCars.length - 1})` : ''}` : "Không có xe"}
                    </p>
                  </div>
                </div>
                <div className="modern-lpr-item-waiting-badge">
                  <span className="modern-lpr-item-waiting-badge-text">
                    {waitingCars.length}
                  </span>
                </div>
              </div>

              {/* Chưa Check-in */}
              <div
                className="modern-lpr-item-checkin"
                onClick={() => needCheckinCars.length > 0 && setSelectedBooking(needCheckinCars[0])}
                style={{ cursor: needCheckinCars.length > 0 ? 'pointer' : 'default' }}
              >
                <div className="modern-lpr-item-checkin-left">
                  <svg className="modern-lpr-item-checkin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <div className="modern-lpr-item-checkin-text-container">
                    <h5 className="modern-lpr-item-checkin-title">CHƯA CHECK-IN</h5>
                    <p className="modern-lpr-item-checkin-desc">
                      {needCheckinCars.length > 0 ? `${needCheckinCars[0].plate !== '-' ? needCheckinCars[0].plate : 'Lịch hẹn'}${needCheckinCars.length > 1 ? ` (+${needCheckinCars.length - 1})` : ''}` : "Không có xe"}
                    </p>
                  </div>
                </div>
                <div className="modern-lpr-item-checkin-badge">
                  <span className="modern-lpr-item-checkin-badge-text">
                    {needCheckinCars.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="modern-lpr-footer">
              <svg className="modern-lpr-footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className="modern-lpr-footer-text">
                Nhận diện tự động
              </span>
            </div>
          </div>

          {/* Loyalty Health - Modernized */}
          {(() => {
            const totalVal = loyaltyStats.totalPoints || 1;
            const circulatingPct = 75;
            const expiringPct = Math.min(100, Math.round((loyaltyStats.expiringSoon / totalVal) * 100)) || 15;
            const expiredPct = Math.min(100, Math.round((loyaltyStats.expired / totalVal) * 100)) || 5;

            return (
              <div className="modern-loyalty-card">
                <div className="modern-loyalty-header">
                  <div className="modern-loyalty-header-icon-bg">
                    <svg className="modern-loyalty-header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="modern-loyalty-header-title-container">
                    <h4 className="modern-loyalty-header-title">
                      Sức khỏe Loyalty
                    </h4>
                    <h5 className="modern-loyalty-header-subtitle">
                      Loyalty Health
                    </h5>
                  </div>
                </div>

                <div className="modern-loyalty-body">
                  {/* Tổng điểm lưu hành */}
                  <div className="modern-loyalty-item">
                    <div className="modern-loyalty-item-info">
                      <span className="modern-loyalty-item-label">TỔNG ĐIỂM LƯU HÀNH</span>
                      <span className="modern-loyalty-item-value circulating">
                        {loyaltyStats.totalPoints?.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="modern-loyalty-progress-bg">
                      <div className="modern-loyalty-progress-fill circulating" style={{ width: `${circulatingPct}%` }}></div>
                    </div>
                  </div>

                  {/* Sắp hết hạn */}
                  <div className="modern-loyalty-item">
                    <div className="modern-loyalty-item-info">
                      <span className="modern-loyalty-item-label">SẮP HẾT HẠN (≤ 30 NGÀY)</span>
                      <span className="modern-loyalty-item-value expiring">
                        {loyaltyStats.expiringSoon?.toLocaleString()} pts
                      </span>
                    </div>
                    {loyaltyStats.expiringSoon > 0 && (
                      <div className="modern-loyalty-progress-bg">
                        <div className="modern-loyalty-progress-fill expiring" style={{ width: `${expiringPct}%` }}></div>
                      </div>
                    )}
                  </div>

                  {/* Đã hết hạn */}
                  <div className="modern-loyalty-item">
                    <div className="modern-loyalty-item-info">
                      <span className="modern-loyalty-item-label">ĐÃ HẾT HẠN</span>
                      <span className="modern-loyalty-item-value expired">
                        {loyaltyStats.expired?.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="modern-loyalty-progress-bg">
                      <div className="modern-loyalty-progress-fill expired" style={{ width: `${expiredPct}%` }}></div>
                    </div>
                  </div>

                  <button className="modern-loyalty-button" onClick={() => navigate('/admin/tiers')}>
                    CẤU HÌNH HẠNG
                  </button>
                </div>
              </div>
            );
          })()}


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
                      <span className="bookings-customer-name" style={{ padding: 0, fontSize: '13.5px', fontWeight: 600 }}>
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
