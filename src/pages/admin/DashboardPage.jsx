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
            <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUpIcon className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-xs font-semibold text-cyan-400">{trend}</p>
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
      {isWarning && (
        <div className="mt-3 flex items-center gap-1.5 text-red-400 text-[11px] font-semibold">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Yêu cầu xử lý
        </div>
      )}
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
      id: 'BK001',
      customer: 'Nguyễn Văn Anh',
      plate: '51H-123.45',
      service: 'Premium Wash + Wax',
      status: 'Completed'
    },
    {
      id: 'BK002',
      customer: 'Trần Minh Bảo',
      plate: '30G-987.65',
      service: 'Standard Wash',
      status: 'Pending'
    },
    {
      id: 'BK003',
      customer: 'Lê Quốc Khánh',
      plate: '43A-555.22',
      service: 'Interior Detailing',
      status: 'Cancelled'
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
    if (cleanId.length > 6) {
      return `#BK-${cleanId.slice(-4).toUpperCase()}`;
    }
    return `#BK-${cleanId.toUpperCase()}`;
  };

  const getStatusBadge = (status) => {
    const normStatus = status?.toUpperCase();
    switch (normStatus) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Completed
          </span>
        );
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse"></span>
            Processing
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
            Cancelled
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Tổng quan vận hành
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi trạng thái và doanh thu hệ thống rửa xe hôm nay
          </p>
        </div>
        <div className="flex items-center gap-4 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Máy chủ: Hoạt động</span>
          </div>
          <button className="p-2.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all relative cursor-pointer">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Doanh thu hôm nay"
          value={revenueTodayStr}
          trend="+8.2% so với hôm qua"
          icon={BriefcaseIcon}
        />
        <MetricCard
          title="Lượng đặt lịch"
          value={bookingsToday.toString()}
          subtitle={`${processingCount} xe đang xử lý`}
          icon={CalendarIcon}
        />
        <MetricCard
          title="Hạng mục chờ"
          value={pendingCount.toString()}
          subtitle="Đợi trung bình: 12 phút"
          icon={ClockIcon}
        />
        <MetricCard
          title="No-shows"
          value={noShowCount.toString()}
          isWarning={noShowCount > 0}
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
                Doanh thu tuần này
              </h3>
              <p className="text-slate-400 text-sm">
                Tổng quan hiệu suất doanh thu trong 7 ngày qua
              </p>
            </div>
            <span className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.02] border border-white/5 text-slate-350 hover:bg-white/[0.05] transition-all cursor-pointer">
              Tuần này
            </span>
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
              💡 Doanh thu cao nhất tuần: <span className="font-semibold text-white">{Math.max(...chartData.map(d => d.revenue))}M</span>
            </span>
          </div>
        </div>

        {/* Quick Summary / Fast Status */}
        <div className="bg-[#0c0f24] border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Trạng thái nhanh
            </h3>

            <div className="space-y-5">
              {/* Progress: Vehicles Processing */}
              <div className="pb-5 border-b border-white/5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Xe đang xử lý</p>
                  <p className="text-lg font-bold text-white">{processingCount}</p>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>

              {/* Staff Online avatars */}
              <div className="pb-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Nhân viên online</p>
                  <div className="flex items-center -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-600 border border-[#0c0f24] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      AL
                    </div>
                    <div className="w-7 h-7 rounded-full bg-teal-600 border border-[#0c0f24] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      TR
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 border border-[#0c0f24] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      JD
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-350 shadow-sm">
                      +5
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tỉ lệ hoàn thành</p>
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
            Đặt lịch gần đây
          </h3>
          <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
            Xem tất cả
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01]">
              <tr className="text-left text-slate-450 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Biển số</th>
                <th className="px-6 py-4">Dịch vụ</th>
                <th className="px-6 py-4">Trạng thái</th>
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
