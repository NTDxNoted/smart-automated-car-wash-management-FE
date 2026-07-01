import { useEffect, useState } from 'react';
import adminBookingService from '../../services/adminBookingService';

const STAT_CARDS = [
  {
    label: "Today's Revenue",
    value: '12.4M',
    description: '↗ +8.2% vs yesterday',
    descColor: 'text-emerald-500',
    icon: 'payments',
    iconBg: 'bg-cyan-500 text-white',
  },
  {
    label: 'Active Bookings',
    value: '28',
    description: '14 currently processing',
    descColor: 'text-slate-500',
    icon: 'event_note',
    iconBg: 'bg-[#d6e4ff] text-[#1e40af]',
  },
  {
    label: 'Pending Services',
    value: '6',
    description: 'Avg wait time: 12m',
    descColor: 'text-slate-500',
    icon: 'history_toggle_off',
    iconBg: 'bg-slate-200 text-slate-600',
  },
  {
    label: 'No-shows',
    value: '2',
    description: '⚠ Requires follow-up',
    descColor: 'text-rose-500',
    icon: 'event_busy',
    iconBg: 'bg-rose-100 text-rose-600',
  },
];

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

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setLoadingBookings(true);
        const res = await adminBookingService.getAll({ page: 1, pageSize: 4 });
        const data = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];
        setRecentBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Lỗi lấy booking:', error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchRecentBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((item, index) => (
          <div key={item.label} className={`rounded-xl border bg-white p-5 shadow-sm ${index === 3 ? 'border-rose-200' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">{item.value}</h3>
                <p className={`mt-2 text-xs font-medium ${item.descColor}`}>{item.description}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
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
            {/* Custom chart mockup replicating Figma exactly */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
              <div className="border-b border-slate-100 flex items-center justify-between pb-1"><span className="w-8">20M</span></div>
              <div className="border-b border-slate-100 flex items-center justify-between pb-1"><span className="w-8">15M</span></div>
              <div className="border-b border-slate-100 flex items-center justify-between pb-1"><span className="w-8">10M</span></div>
              <div className="border-b border-slate-100 flex items-center justify-between pb-1"><span className="w-8">5M</span></div>
              <div className="border-b border-slate-100 flex items-center justify-between pb-1"><span className="w-8">0</span></div>
            </div>
            <div className="absolute inset-x-8 inset-y-0 pb-6 pt-3">
              <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,180 L50,140 L100,100 L150,140 L200,180 L250,90 L300,130 L350,80 L400,60 L400,240 L0,240 Z" fill="url(#areaGradient)" />
                <path d="M0,180 L50,140 L100,100 L150,140 L200,180 L250,90 L300,130 L350,80 L400,60" fill="none" stroke="#0891b2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="350" cy="80" r="5" fill="white" stroke="#0891b2" strokeWidth="3" />
              </svg>
              <div className="absolute left-[85%] top-[15%] -translate-x-1/2 -translate-y-full pb-2">
                <div className="rounded bg-slate-800 px-2 py-1 text-xs font-bold text-white shadow">15.2M</div>
              </div>
            </div>
            <div className="absolute inset-x-8 bottom-0 flex justify-between text-xs font-semibold text-slate-400">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-cyan-600">T8</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Fast Status</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
              <p className="text-sm font-medium text-slate-500">Vehicles Processing</p>
              <div className="mt-1 flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-slate-800">14</span>
                <div className="flex-1 max-w-[120px] h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0891b2] rounded-full" style={{ width: '60%' }}></div>
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
                <p className="text-2xl font-bold text-slate-800 mt-1">92%</p>
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

