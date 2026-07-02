import { useState, useEffect, useMemo, useCallback } from "react";
import BookingTable from "../../components/admin/BookingTable";
import BookingDetailDrawer from "../../components/admin/BookingDetailDrawer";
import adminBookingService from "../../services/adminBookingService";

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    keyword: "",
    page: 1,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await adminBookingService.getAll(filters);
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(b => ({
        id: b.bookingID ?? b.bookingId ?? b.id,
        customerName: b.customerName ?? "Guest",
        phone: b.phone,
        licensePlate: b.licensePlate,
        status: b.status,
        totalAmount: b.finalAmount ?? b.baseAmount ?? b.totalAmount,
        scheduledTime: b.scheduledTime,
      }));

      setBookings(mapped);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý đặt lịch</h2>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi, check-in và xử lý thanh toán cho đơn đặt rửa xe
          </p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="grid md:grid-cols-3 gap-4 bg-[#0c0f24] p-5 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="w-full bg-[#070913] border border-white/10 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition cursor-pointer appearance-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý (Pending)</option>
            <option value="COMPLETED">Đã hoàn thành (Completed)</option>
            <option value="FAILED">Thất bại (Failed)</option>
            <option value="CANCELLED">Đã hủy (Cancelled)</option>
            <option value="NOSHOW">Không đến (No-show)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value, page: 1 })
          }
          className="bg-[#070913] border border-white/10 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition w-full"
        />

        <div className="relative">
          <input
            placeholder="Tìm kiếm theo SĐT hoặc biển số..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value, page: 1 })
            }
            className="w-full bg-[#070913] border border-white/10 text-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        onRowClick={setSelectedBooking}
      />

      {/* PAGINATION */}
      <div className="flex justify-between items-center bg-[#0c0f24] px-6 py-4 rounded-2xl border border-white/5 shadow-md">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Trang {filters.page}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={filters.page === 1 || loading}
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-[#070913] border border-white/5 text-slate-350 hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            ← Trước
          </button>

          <button
            type="button"
            disabled={bookings.length === 0 || loading}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-[#070913] border border-white/5 text-slate-350 hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* DRAWER */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={fetchBookings}
      />
    </div>
  );
}
