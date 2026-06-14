import { useState, useEffect, useMemo, useCallback } from "react";

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

      setBookings(res.data);
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
            setFilters({ ...filters, status: e.target.value })
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
            setFilters({ ...filters, date: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Tìm SĐT / biển số"
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
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
