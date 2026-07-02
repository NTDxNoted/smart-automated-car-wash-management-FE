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
function MetricCard({ title, value, subtitle, trend, icon: Icon, isWarning = false }) {
  return (
    <div className={`rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-2px] ${
      isWarning 
        ? 'bg-red-500/[0.02] border-red-500/20 hover:border-red-500/35 hover:shadow-[0_8px_20px_rgba(239,68,68,0.06)]' 
        : 'bg-[#0c0f24] border-white/5 hover:border-cyan-500/20 hover:shadow-[0_8px_20px_rgba(6,182,212,0.05)]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-3 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-2.5 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <TrendingUpIcon className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-xs font-semibold text-cyan-400">{trend}</p>
            </div>
          )}
          {isWarning && (
            <div className="mt-2.5 flex items-center gap-1.5 text-red-400 text-xs font-semibold">
              <AlertTriangleIcon className="w-3.5 h-3.5 text-red-400" />
              <span>Requires follow-up</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isWarning
            ? 'bg-red-500/10 text-red-400 border border-red-500/10'
            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/60 text-slate-300 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            Completed
          </span>
        );
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500 text-white shadow-sm border border-cyan-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
            Processing
          </span>
        );
      case 'CANCELLED':
      case 'CANCEL':
      case 'CANCEL_BY_ADMIN':
      case 'CANCEL_BY_CUSTOMER':
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
            Canceled
          </span>
        );
      case 'NOSHOW':
      case 'NO-SHOW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            No-show
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5 animate-pulse"></span>
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Revenue"
          value={revenueTodayStr}
          trend="+8.2% vs yesterday"
          icon={BriefcaseIcon}
        />
        <MetricCard
          title="Active Bookings"
          value={bookingsToday.toString()}
          subtitle="14 currently processing"
          icon={CalendarIcon}
        />
        <MetricCard
          title="Pending Services"
          value={pendingCount.toString()}
          subtitle="Avg wait time: 12m"
          icon={ClockIcon}
        />
        <MetricCard
          title="No-shows"
          value={noShowCount.toString()}
          isWarning={true}
          icon={AlertTriangleIcon}
        />
      </div>

      {/* Main Charts & Side panel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue AreaChart */}
        <div className="lg:col-span-2 bg-[#0c0f24] border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">
                Revenue This Week
              </h3>
              <p className="text-slate-400 text-sm">
                7-day performance overview
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.02] border border-white/5 text-slate-350 hover:bg-white/[0.05] transition-all cursor-pointer shadow-sm">
              <span>This Week</span>
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0c0f24',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                  itemStyle={{ color: '#06b6d4' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}M`, 'Doanh thu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={{ fill: '#06b6d4', strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">
              💡 Highest this week: <span className="font-semibold text-white">{Math.max(...chartData.map(d => d.revenue))}M</span>
            </span>
          </div>
        </div>

        {/* Quick Summary / Fast Status */}
        <div className="bg-[#0c0f24] border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Fast Status
            </h3>

            <div className="space-y-5">
              {/* Progress: Vehicles Processing */}
              <div className="pb-5 border-b border-white/5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Vehicles Processing</p>
                  <p className="text-lg font-bold text-white">{processingCount}</p>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>

              {/* Staff Online avatars */}
              <div className="pb-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Staff Online</p>
                  <div className="flex items-center -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 border border-[#0c0f24] flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0">
                      J
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-500 border border-[#0c0f24] flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0">
                      M
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-500 border border-[#0c0f24] flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0">
                      S
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[9px] font-bold text-slate-300 shadow-sm shrink-0">
                      +5
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white">92%</p>
                    <CheckCircleIcon className="w-5.5 h-5.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-[#0c0f24] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white text-lg font-bold">
            Recent Bookings
          </h3>
          <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
            View All
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01]">
              <tr className="text-left text-slate-450 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">CODE</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">LICENSE PLATE</th>
                <th className="px-6 py-4">SERVICE</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-white/[0.01] transition-all duration-150"
                >
                  <td className="px-6 py-4 text-white font-medium font-mono text-sm">
                    {formatBookingId(booking.id)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md shrink-0">
                        {getInitials(booking.customer)}
                      </div>
                      <p className="text-sm font-medium text-slate-200">{booking.customer}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-300 font-mono text-sm font-semibold tracking-wider">
                     {booking.plate}
                  </td>

                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {booking.service}
                  </td>

                  <td className="px-6 py-4">
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
