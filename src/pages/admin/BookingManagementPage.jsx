import { useState, useEffect } from "react";
import BookingTable from "../../components/admin/BookingTable";
import BookingDetailDrawer from "../../components/admin/BookingDetailDrawer";
import adminBookingService from "../../services/adminBookingService";
import "./BookingManagementPage.css";

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
        services: b.services || b.serviceNames || b.serviceName || b.service || [],
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
    <div className="booking-page-container">
      
      {/* Filters and Search Row */}
      <div className="booking-filters-row">
        
        {/* Status Dropdown */}
        <div className="booking-select-wrapper">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="booking-select"
          >
            <option value="">All status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NOSHOW">No-show</option>
          </select>
          <svg className="booking-select-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Date Picker */}
        <div className="booking-date-wrapper">
          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value, page: 1 })
            }
            className="booking-date-input"
            placeholder="mm/dd/yyyy"
          />
        </div>

        {/* Search Input */}
        <div className="booking-search-wrapper">
          <input
            placeholder="Search SĐT hoặc biển số..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value, page: 1 })
            }
            className="booking-search-input"
          />
          <svg className="booking-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

      </div>

      {/* Booking List Table (Data Card) */}
      <div className="booking-data-card">
        <BookingTable
          bookings={bookings}
          loading={loading}
          onRowClick={setSelectedBooking}
        />

        {/* Pagination Panel */}
        <div className="booking-pagination-row">
          <div className="booking-pagination-info">
            Hiển thị {bookings.length > 0 ? 1 : 0} đến {bookings.length} trong {bookings.length} kết quả
          </div>
          <div className="booking-pagination-nav">
            <span className="booking-pagination-label">Trang {filters.page}</span>
            <div className="booking-pagination-actions">
              <button
                type="button"
                disabled={filters.page === 1 || loading}
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                className="booking-pagination-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 mr-1">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Trước
              </button>
              <button
                type="button"
                disabled={bookings.length === 0 || loading}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="booking-pagination-btn"
              >
                Sau
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 ml-1">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={fetchBookings}
      />
    </div>
  );
}
