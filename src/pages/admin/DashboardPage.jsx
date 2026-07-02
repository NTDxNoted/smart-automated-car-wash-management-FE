import { useState, useEffect } from 'react';
import adminBookingService from '../../services/adminBookingService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

function BellIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎛️ CUSTOM METRIC CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MetricCard({ title, value, subtitle, trend, icon: Icon, type }) {
  const isWarning = type === 'no-shows';
  return (
    <div className={`metric-card-custom ${type}`}>
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
            <span>Requires follow-up</span>
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
  const [bookingsToday, setBookingsToday] = useState(28);
  const [revenueTodayStr, setRevenueTodayStr] = useState('12.4M');
  const [pendingCount, setPendingCount] = useState(6);
  const [noShowCount, setNoShowCount] = useState(2);
  const [processingCount, setProcessingCount] = useState(14);
  const [chartData, setChartData] = useState([
    { day: 'T2', revenue: 3.2 },
    { day: 'T3', revenue: 9.8 },
    { day: 'T4', revenue: 8.5 },
    { day: 'T5', revenue: 5.2 },
    { day: 'T6', revenue: 10.5 },
    { day: 'T7', revenue: 8.9 },
    { day: 'T8', revenue: 15.2 },
  ]);
  const [recentBookings, setRecentBookings] = useState([
    {
      id: '1042',
      customer: 'Nguyen Linh',
      plate: '29A-123.45',
      service: 'Premium Wash + Wax',
      status: 'Processing'
    },
    {
      id: '1041',
      customer: 'Tran Minh',
      plate: '30G-987.65',
      service: 'Standard Wash',
      status: 'Completed'
    },
    {
      id: '1040',
      customer: 'Hoang Anh',
      plate: '51F-555.22',
      service: 'Interior Detailing',
      status: 'Cancelled'
    },
    {
      id: '1039',
      customer: 'Vu Tuan',
      plate: '29C-444.11',
      service: 'Express Wash',
      status: 'Completed'
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminBookingService.getAll({ pageSize: 1000 });
        const list = res.data?.data || res.data || [];
        if (list.length > 0) {
          const todayDateStr = new Date().toLocaleDateString('en-CA');

          let bToday = 0;
          let rToday = 0;
          let pCount = 0;
          let nsCount = 0;
          let prCount = 0;

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
            const bDate = b.scheduledTime ? new Date(b.scheduledTime).toLocaleDateString('en-CA') : '';
            const isBToday = bDate === todayDateStr;

            if (isBToday) {
              bToday++;
              if (bStatus === 'COMPLETED') {
                rToday += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? 0);
              }
              if (bStatus === 'NOSHOW' || bStatus === 'NO-SHOW' || bStatus === 'NO_SHOW') {
                nsCount++;
              }
            }

            if (bStatus === 'PENDING') {
              pCount++;
            }

            if (bStatus === 'PROCESSING' || bStatus === 'IN-PROGRESS' || bStatus === 'IN_PROGRESS') {
              prCount++;
            }

            // Aggregate weekly revenue
            if (bStatus === 'COMPLETED') {
              const dayBucket = last7Days.find(item => item.dateStr === bDate);
              if (dayBucket) {
                dayBucket.revenue += Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? 0);
              }
            }
          });

          // Set dynamic counters
          setBookingsToday(bToday);
          setPendingCount(pCount);
          setNoShowCount(nsCount);
          setProcessingCount(prCount > 0 ? prCount : Math.min(Math.ceil(bToday * 0.4), bToday) || 14);

          let formattedRevenue = rToday >= 1000000
            ? `${(rToday / 1000000).toFixed(1)}M`
            : `${rToday.toLocaleString()}đ`;
          setRevenueTodayStr(formattedRevenue);

          // Update chart dataset
          const totalWeeklyRevenue = last7Days.reduce((sum, item) => sum + item.revenue, 0);
          if (totalWeeklyRevenue > 0) {
            setChartData(last7Days.map(item => ({
              day: item.day,
              revenue: Number((item.revenue / 1000000).toFixed(2)),
            })));
          }

          // Top 5 sorted bookings
          const sortedList = [...list].sort((a, b) => new Date(b.scheduledTime || b.createdAt) - new Date(a.scheduledTime || a.createdAt));
          const top5 = sortedList.slice(0, 5).map(b => ({
            id: b.bookingID ?? b.bookingId ?? b.id,
            customer: b.customerName ?? b.phone ?? 'Khách hàng',
            plate: b.licensePlate || '-',
            service: b.serviceName || 'Rửa Xe',
            status: b.status || 'Pending'
          }));
          if (top5.length > 0) {
            setRecentBookings(top5);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const renderAvatar = (customer) => {
    if (customer === 'Tran Minh') {
      return (
        <div className="w-8 h-8 rounded-full border border-[#BCC8CE] bg-white flex items-center justify-center text-[#BCC8CE] shrink-0">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }

    let bgClass = "bg-[#C9DBFD] text-[#4F607D]"; // default (e.g. NL, VT)
    if (customer === 'Hoang Anh') {
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
            <span className="status-text">Completed</span>
          </span>
        );
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return (
          <span className="status-badge-figma processing">
            <span className="status-dot"></span>
            <span className="status-text">Processing</span>
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
            <span className="status-text">Canceled</span>
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
            <span className="status-text text-amber-700">Pending</span>
          </span>
        );
    }
  };

  const maxRevenueItem = chartData.reduce((prev, curr) => (curr.revenue > prev.revenue) ? curr : prev, chartData[0]) || { day: 'T8', revenue: 15.2 };

  return (
    <div className="dashboard-container">
      <div className="dashboard-page-subtitle"></div>
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <MetricCard
          title="Today's Revenue"
          value={revenueTodayStr}
          trend="+8.2% vs yesterday"
          icon={BriefcaseIcon}
          type="revenue"
        />
        <MetricCard
          title="Active Bookings"
          value={bookingsToday.toString()}
          subtitle="14 currently processing"
          icon={CalendarIcon}
          type="bookings"
        />
        <MetricCard
          title="Pending Services"
          value={pendingCount.toString()}
          subtitle="Avg wait time: 12m"
          icon={ClockIcon}
          type="services"
        />
        <MetricCard
          title="No-shows"
          value={noShowCount.toString()}
          icon={AlertTriangleIcon}
          type="no-shows"
        />
      </div>

      {/* Main Charts & Side panel Section */}
      <div className="dashboard-grid">
        {/* Weekly Revenue AreaChart */}
        <div className="chart-section dashboard-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#111C2C] font-bold text-lg" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                Revenue This Week
              </h3>
              <p className="text-[#3D494D] text-sm">
                7-day performance overview
              </p>
            </div>
            <button className="chart-option-btn">
              <span>This Week</span>
              <svg className="w-3.5 h-3.5 ml-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div className="w-full h-64">
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
                  tick={{ fontSize: 11, fill: '#6D797E' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6D797E"
                  tick={{ fontSize: 11, fill: '#6D797E' }}
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
                  formatter={(value) => [`${value}M`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00677F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={{ fill: '#F9F9FF', stroke: '#00677F', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#00677F' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-[#F0F3FF] border border-transparent rounded-xl text-xs text-[#3D494D] flex items-center justify-between">
            <span>
              Peak performance this week: <span className="font-bold text-[#00677F]">{maxRevenueItem.revenue}M</span> on {maxRevenueItem.day}
            </span>
          </div>
        </div>

        {/* Quick Summary / Fast Status */}
        <div className="dashboard-card flex flex-col justify-between">
          <div>
            <h3 className="text-[#111C2C] font-bold text-lg mb-6" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Fast Status
            </h3>

            <div className="space-y-4">
              {/* Progress: Vehicles Processing */}
              <div className="fast-status-item">
                <div className="flex items-center justify-between w-full mb-1">
                  <p className="text-[#3D494D] text-xs font-semibold uppercase tracking-wider">Vehicles Processing</p>
                  <p className="text-3xl font-extrabold text-[#111C2C]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{processingCount}</p>
                </div>
                <div className="w-full bg-[#BCC8CE]/30 rounded-full h-2 overflow-hidden relative">
                  <div
                    className="h-full bg-[#00677F] rounded-full transition-all"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>

              {/* Staff Online avatars */}
              <div className="fast-status-item">
                <div className="flex items-center justify-between w-full mb-2">
                  <p className="text-[#3D494D] text-xs font-semibold uppercase tracking-wider">Staff Online</p>
                  <p className="text-3xl font-extrabold text-[#111C2C]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>8</p>
                </div>
                <div className="flex items-center -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#00A9CE] border border-[#F9F9FF] flex items-center justify-center text-[10px] font-bold text-[#003846] shadow-sm shrink-0">
                    J
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#C9DBFD] border border-[#F9F9FF] flex items-center justify-center text-[10px] font-bold text-[#4F607D] shadow-sm shrink-0">
                    M
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#949D9E] border border-[#F9F9FF] flex items-center justify-center text-[10px] font-bold text-[#2C3536] shadow-sm shrink-0">
                    S
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#D8E3FA] border border-[#F9F9FF] flex items-center justify-center text-[9px] font-bold text-[#3D494D] shadow-sm shrink-0">
                    +5
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="fast-status-item">
                <div className="flex items-center justify-between w-full">
                  <p className="text-[#3D494D] text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-extrabold text-[#111C2C]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>92%</p>
                    <CheckCircleIcon className="w-6 h-6 text-[#00677F]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bookings-table-container">
        <div className="bookings-header-row">
          <h3 className="text-[#111C2C] text-lg font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Recent Bookings
          </h3>
          <button className="bookings-view-all-btn">
            View All
          </button>
        </div>

        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr className="bookings-thead-row">
                <th className="bookings-th code">CODE</th>
                <th className="bookings-th customer">CUSTOMER</th>
                <th className="bookings-th plate">LICENSE PLATE</th>
                <th className="bookings-th service">SERVICE</th>
                <th className="bookings-th status">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="bookings-tbody-row"
                >
                  <td className="bookings-td code">
                    {formatBookingId(booking.id)}
                  </td>

                  <td className="bookings-td customer">
                    {renderAvatar(booking.customer)}
                    <span className="bookings-td customer-name">{booking.customer}</span>
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
    </div>
  );
}
