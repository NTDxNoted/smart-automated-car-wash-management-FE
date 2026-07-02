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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Quản lý đặt lịch</h2>
          <p className="text-slate-400 text-sm mt-1">
            Danh sách tất cả booking rửa xe và trạng thái
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="grid md:grid-cols-3 gap-4 bg-[#0c0f24] p-5 rounded-2xl border border-white/5 shadow-lg">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
          className="bg-[#070913] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NOSHOW">No-show</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value, page: 1 })
          }
          className="bg-[#070913] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition"
        />

        <input
          placeholder="Tìm SĐT hoặc biển số..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
          className="bg-[#070913] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition w-full"
        />
      </div>

      {/* TABLE */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        onRowClick={setSelectedBooking}
      />

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          type="button"
          disabled={filters.page === 1 || loading}
          onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
          className="px-4 py-2 rounded-xl bg-[#0c0f24] border border-white/5 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
        >
          Trước
        </button>

        <span className="px-4 text-slate-400 text-sm font-medium">
          Trang {filters.page}
        </span>

        <button
          type="button"
          disabled={bookings.length === 0 || loading}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          className="px-4 py-2 rounded-xl bg-[#0c0f24] border border-white/5 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
        >
          Sau
        </button>
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
