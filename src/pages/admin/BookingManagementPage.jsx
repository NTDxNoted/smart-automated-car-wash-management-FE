import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookingTable from "../../components/admin/BookingTable";
import BookingDetailDrawer from "../../components/admin/BookingDetailDrawer";
import WalkInModal from "../../components/admin/WalkInModal";
import adminBookingService from "../../services/adminBookingService";
import "./BookingManagementPage.css";

export default function BookingManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openWalkInModal, setOpenWalkInModal] = useState(false);

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    date: searchParams.get("date") || "",
    keyword: searchParams.get("keyword") || "",
    hour: "",
    page: 1,
  });

  useEffect(() => {
    setFilters({
      status: searchParams.get("status") || "",
      date: searchParams.get("date") || "",
      keyword: searchParams.get("keyword") || "",
      hour: "",
      page: 1,
    });
  }, [searchParams]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const apiFilters = {
        status: filters.status,
        date: filters.date,
        keyword: filters.keyword,
      };
      const res = await adminBookingService.getAll(apiFilters);
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(b => ({
        id: b.bookingID ?? b.bookingId ?? b.id,
        customerName: b.customerName ?? "Guest",
        phone: b.phone,
        licensePlate: b.licensePlate,
        status: b.status,
        totalAmount: b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? b.totalPrice,
        scheduledTime: b.scheduledTime,
        services: b.services || b.serviceNames || b.serviceName || b.service || [],
        isWalkIn: b.isWalkIn !== undefined ? b.isWalkIn : (b.IsWalkIn !== undefined ? b.IsWalkIn : (b.isWalkin || false)),
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
  }, [filters.status, filters.date, filters.keyword]);

  useEffect(() => {
    const handleDataUpdate = () => {
      console.log("BookingManagementPage: Nhận thông báo dữ liệu thay đổi, tự động làm mới bảng...");
      fetchBookings();
    };
    window.addEventListener("autowash_data_updated", handleDataUpdate);
    return () => {
      window.removeEventListener("autowash_data_updated", handleDataUpdate);
    };
  }, [filters.status, filters.date, filters.keyword]);

  const PAGE_SIZE = 10;

  const filteredBookings = bookings.filter(b => {
    if (!filters.hour) return true;
    if (!b.scheduledTime) return false;
    const dateObj = new Date(b.scheduledTime);
    const hour = dateObj.getHours();
    return hour === parseInt(filters.hour, 10);
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));

  const paginatedBookings = filteredBookings.slice(
    (filters.page - 1) * PAGE_SIZE,
    filters.page * PAGE_SIZE
  );

  return (
    <div className="admin-booking-page-container">

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
            <option value="FAILED">Failed</option>
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

        {/* Hour Dropdown */}
        <div className="booking-select-wrapper">
          <select
            value={filters.hour}
            onChange={(e) =>
              setFilters({ ...filters, hour: e.target.value, page: 1 })
            }
            className="booking-select"
          >
            <option value="">Tất cả giờ</option>
            <option value="7">07:00 - 08:00</option>
            <option value="8">08:00 - 09:00</option>
            <option value="9">09:00 - 10:00</option>
            <option value="10">10:00 - 11:00</option>
            <option value="11">11:00 - 12:00</option>
            <option value="12">12:00 - 13:00</option>
            <option value="13">13:00 - 14:00</option>
            <option value="14">14:00 - 15:00</option>
            <option value="15">15:00 - 16:00</option>
            <option value="16">16:00 - 17:00</option>
            <option value="17">17:00 - 18:00</option>
            <option value="18">18:00 - 19:00</option>
          </select>
          <svg className="booking-select-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
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
          bookings={paginatedBookings}
          loading={loading}
          onRowClick={setSelectedBooking}
        />

        {/* Pagination Panel */}
        <div className="booking-pagination-row">
          <div className="booking-pagination-info">
            Hiển thị {filteredBookings.length > 0 ? (filters.page - 1) * PAGE_SIZE + 1 : 0} đến {Math.min(filters.page * PAGE_SIZE, filteredBookings.length)} trong {filteredBookings.length} kết quả
          </div>
          <div className="booking-pagination-nav">
            <span className="booking-pagination-label">Trang {filters.page} / {totalPages}</span>
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
                disabled={filters.page >= totalPages || loading}
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

      {/* Action Container for Walk-In Booking below the table */}
      <div className="flex justify-end pt-2 pb-4">
        <button
          type="button"
          onClick={() => setOpenWalkInModal(true)}
          className="booking-add-walkin-btn"
        >
          <span>+</span> Đặt lịch khách vãng lai
        </button>
      </div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={fetchBookings}
      />

      {/* Walk-In Booking Modal */}
      <WalkInModal
        open={openWalkInModal}
        onClose={() => setOpenWalkInModal(false)}
        onSuccess={fetchBookings}
        existingBookings={bookings}
      />
    </div>
  );
}
