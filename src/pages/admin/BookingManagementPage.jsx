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
    <div className="p-6">
      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">All status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value, page: 1 })
          }
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Tìm SĐT / biển số"
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {/* TABLE */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        onRowClick={setSelectedBooking}
      />

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
