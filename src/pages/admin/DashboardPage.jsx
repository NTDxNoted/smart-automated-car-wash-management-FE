import { useEffect, useState } from 'react';
import adminBookingService from '../../services/adminBookingService';
import { getOverviewReport } from '../../services/adminReportService';
import OverviewChart from '../../components/admin/OverviewChart';

const STATUS_BADGES = {
  Processing: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-slate-100 text-slate-600',
  Canceled: 'bg-rose-100 text-rose-600',
  NoShow: 'bg-rose-100 text-rose-600',
};

function getStatusLabel(status) {
  if (!status) return 'Unknown';
  if (status.toLowerCase().includes('complete')) return 'Completed';
  if (status.toLowerCase().includes('pending') || status.toLowerCase().includes('process')) return 'Processing';
  if (status.toLowerCase().includes('cancel')) return 'Canceled';
  if (status.toLowerCase().includes('no') && status.toLowerCase().includes('show')) return 'NoShow';
  return status;
}

export default function DashboardPage() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingOverview(true);
        const report = await getOverviewReport();
        setOverview(report);
      } catch (error) {
        console.error('Lỗi lấy overview:', error);
      } finally {
        setLoadingOverview(false);
      }

      try {
        setLoadingBookings(true);
        const res = await adminBookingService.getAll({ page: 1, pageSize: 4 });
        const data = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];
        const bookingsArray = Array.isArray(data) ? data : [];
        setRecentBookings(bookingsArray.slice(0, 4)); // Only keep the newest 4 for the table

        // Calculate weekly revenue from all bookings fetched
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const today = new Date();
        const weeklyData = [];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          d.setHours(0, 0, 0, 0);
          const nextD = new Date(d);
          nextD.setDate(d.getDate() + 1);
          
          const dayBookings = bookingsArray.filter(b => {
            if (!b.scheduledTime && !b.createdAt) return false;
            const bDate = new Date(b.scheduledTime || b.createdAt);
            const status = b.status?.toLowerCase() || '';
            return bDate >= d && bDate < nextD && status.includes('complete');
          });
          
          const revenue = dayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
          
          weeklyData.push({
            month: i === 0 ? 'Nay' : days[d.getDay()],
            revenue: revenue
          });
        }
        
        setWeeklyRevenue(weeklyData);

      } catch (error) {
        console.error('Lỗi lấy booking:', error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchData();
  }, []);

  const statCards = overview ? [
    {
      label: "Revenue (" + (overview.revenue[0]?.month || 'Current') + ")",
      value: (overview.summary.revenue / 1000000).toFixed(1) + 'M',
      description: 'Tổng doanh thu',
      descColor: 'text-emerald-500',
      icon: 'payments',
      iconBg: 'bg-cyan-500 text-white',
    },
    {
      label: 'Total Bookings',
      value: overview.summary.bookings.toString(),
      description: 'Số lượng đơn',
      descColor: 'text-slate-500',
      icon: 'event_note',
      iconBg: 'bg-[#d6e4ff] text-[#1e40af]',
    },
    {
      label: 'Pending Bookings',
      value: (overview.bookingStatus.find(s => s.name === 'Pending')?.value || 0).toString(),
      description: 'Đang xử lý',
      descColor: 'text-slate-500',
      icon: 'history_toggle_off',
      iconBg: 'bg-slate-200 text-slate-600',
    },
    {
      label: 'No-shows',
      value: (overview.bookingStatus.find(s => s.name === 'No-Show')?.value || 0).toString(),
      description: '⚠ Cần lưu ý',
      descColor: 'text-rose-500',
      icon: 'event_busy',
      iconBg: 'bg-rose-100 text-rose-600',
    },
  ] : [
    { label: 'Loading...', value: '-', description: '...', icon: 'sync', iconBg: 'bg-slate-100 text-slate-400' },
    { label: 'Loading...', value: '-', description: '...', icon: 'sync', iconBg: 'bg-slate-100 text-slate-400' },
    { label: 'Loading...', value: '-', description: '...', icon: 'sync', iconBg: 'bg-slate-100 text-slate-400' },
    { label: 'Loading...', value: '-', description: '...', icon: 'sync', iconBg: 'bg-slate-100 text-slate-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <div key={index} className={`rounded-xl border bg-white p-5 shadow-sm ${index === 3 ? 'border-rose-200' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">{item.value}</h3>
                <p className={`mt-2 text-xs font-medium ${item.descColor}`}>{item.description}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                <span className={`material-symbols-outlined text-[20px] ${loadingOverview ? 'animate-spin' : ''}`}>{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Revenue This Week</h2>
              <p className="text-sm text-slate-500">7-day performance overview</p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          <div className="mt-8 relative flex-1 min-h-[280px] w-full">
            {weeklyRevenue.length > 0 ? (
              <OverviewChart data={weeklyRevenue} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <span className={`material-symbols-outlined mr-2 ${loadingBookings ? 'animate-spin' : ''}`}>
                  {loadingBookings ? 'sync' : 'bar_chart'}
                </span>
                {loadingBookings ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Fast Status</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
              <p className="text-sm font-medium text-slate-500">Vehicles Processing</p>
              <div className="mt-1 flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-slate-800">
                  {overview ? (overview.bookingStatus.find(s => s.name === 'Pending')?.value || 0) : '...'}
                </span>
                <div className="flex-1 max-w-[120px] h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0891b2] rounded-full" style={{ width: overview && overview.summary.bookings > 0 ? `${((overview.bookingStatus.find(s => s.name === 'Pending')?.value || 0) / overview.summary.bookings) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Staff Online</p>
                <span className="text-2xl font-bold text-slate-800 mt-1 block">8</span>
              </div>
              <div className="flex -space-x-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white ring-2 ring-white">J</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-white">M</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white ring-2 ring-white">S</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">+5</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {overview && overview.summary.bookings > 0 
                    ? Math.round(((overview.bookingStatus.find(s => s.name === 'Completed')?.value || 0) / overview.summary.bookings) * 100) + '%' 
                    : '0%'}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0891b2] text-[#0891b2]">
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Bookings</h2>
          <button className="text-sm font-bold text-cyan-600 hover:text-cyan-700">View All</button>
        </div>

        <div className="w-full overflow-x-auto p-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200">
                <tr className="divide-x divide-slate-200">
                  <th className="px-6 py-4">CODE</th>
                  <th className="px-6 py-4">CUSTOMER</th>
                  <th className="px-6 py-4">LICENSE PLATE</th>
                  <th className="px-6 py-4">SERVICE</th>
                  <th className="px-6 py-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loadingBookings ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không có booking mới</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => {
                    const statusLabel = getStatusLabel(booking.status);
                    const customerName = booking.customerName || booking.customer?.fullName || 'N/A';
                    const initials = customerName !== 'N/A' ? customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
                    return (
                      <tr key={booking.bookingId || booking.id} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                        <td className="px-6 py-4 text-slate-500 font-medium">#{booking.bookingId || booking.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-800">{customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{booking.licensePlate || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{booking.serviceName || booking.service || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_BADGES[statusLabel] || 'bg-slate-100 text-slate-600'}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

