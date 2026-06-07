import { useState, useEffect, useCallback } from "react";
// Import các Service và Components con từ các file độc lập của bạn
import bookingService from "../../services/bookingService";
import BookingCard from "../../components/booking/BookingCard";
import BookingDetailModal from "../../components/booking/BookingDetailModal";
import CancelConfirmDialog from "../../components/booking/CancelConfirmDialog";

export default function BookingHistoryPage() {
  // ─── States Quản lý Dữ liệu & UI ──────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("Tất cả"); // Tất cả / Pending / Completed...
  const [pagi, setPagi] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Quản lý trạng thái đóng/mở các Modal và Dialog
  const [selectedBooking, setSelectedBooking] = useState(null); // Modal chi tiết
  const [bookingToCancel, setBookingToCancel] = useState(null);  // Dialog xác nhận hủy
  const [isCancelling, setIsCancelling] = useState(false);        // Trạng thái chờ API hủy

  // ─── Hàm Fetch dữ liệu từ Service (Quản lý theo Auth ngầm định) ─────────────
  const fetchBookings = useCallback(async (statusFilter, pageNum) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // Chuẩn hóa trạng thái truyền lên API theo đúng đặc tả yêu cầu
      const apiStatus = statusFilter === "Tất cả" ? "" : statusFilter;

      // Gọi qua lớp service tập trung, tự động ăn theo cơ chế MOCK hoặc API thật
      const response = await bookingService.getMyBookings({
        status: apiStatus,
        page: pageNum,
      });

      setBookings(response.bookings || []);
      setPagi({
        page: response.page || pageNum,
        totalPages: response.totalPages || 1,
      });
    } catch (err) {
      console.error("Lỗi khi tải lịch sử booking:", err);
      setErrorMsg("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tự động gọi lại hàm fetch mỗi khi người dùng đổi Tab Filter hoặc chuyển trang phân trang
  useEffect(() => {
    fetchBookings(filter, 1);
  }, [filter, fetchBookings]);

  // ─── Xử lý Hủy Lịch Đặt (BR-63 & Luồng Phản Hồi) ───────────────────────────
  const handleCancelConfirm = async (id) => {
    setIsCancelling(true);
    try {
      // Gọi API hủy lịch đặt
      const res = await bookingService.cancelBooking(id);

      // Hiển thị thông báo Toast thành công lấy số điểm hoàn trả thực tế từ API trả về
      alert(`Hủy lịch đặt thành công! Thao tác đã được xử lý. Bạn được hoàn trả ${res.pointsRefunded} điểm Loyalty.`);

      // Đóng dialog hủy lịch
      setBookingToCancel(null);

      // Nếu modal chi tiết cũng đang mở booking này, cập nhật giao diện hoặc đóng lại
      setSelectedBooking(null);

      // KÍCH HOẠT RELOAD DANH SÁCH: Tải lại trang hiện tại để cập nhật trạng thái mới nhất
      fetchBookings(filter, pagi.page);
    } catch (err) {
      console.error("Lỗi khi hủy đặt lịch:", err);
      const serverCode = err?.response?.data?.code;
      if (serverCode === "CANCELLATION_TIME_EXCEEDED") {
        alert("Lỗi: Quá hạn hủy lịch (Phải hủy trước giờ hẹn tối thiểu 2 tiếng).");
      } else {
        alert("Có lỗi xảy ra khi thực hiện hủy lịch đặt. Vui lòng kiểm tra lại.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  // ─── Danh sách các Tab trạng thái theo thiết kế đặc tả ──────────────────────
  const TABS = ["Tất cả", "Pending", "Completed", "Cancelled", "Failed", "No-show"];

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", background: "#060B0B", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 700, color: "#00DCDC", textShadow: "0 0 10px rgba(0,220,220,0.3)", marginBottom: "24px" }}>
        Lịch Sử Đặt Lịch Của Tôi
      </h1>

      {/* 1. Thanh Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: filter === tab ? "rgba(0, 220, 220, 0.4)" : "transparent",
              background: filter === tab ? "rgba(0, 220, 220, 0.08)" : "transparent",
              color: filter === tab ? "#00DCDC" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Giao diện Trạng thái Loading hoặc báo lỗi */}
      {isLoading && <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>Đang tải lịch sử đặt lịch...</div>}
      {errorMsg && <div style={{ color: "#FF5C5C", padding: "20px", background: "rgba(255,92,92,0.05)", borderRadius: "8px", marginBottom: "20px" }}>{errorMsg}</div>}

      {/* 2. Danh sách hiển thị các Booking Card */}
      {!isLoading && !errorMsg && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.01)", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>
              Không tìm thấy lịch sử đặt lịch nào ứng với trạng thái này.
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                onOpenDetail={setSelectedBooking}
                onCancel={setBookingToCancel}
              />
            ))
          )}
        </div>
      )}

      {/* 3. Cụm điều khiển Phân Trang */}
      {!isLoading && bookings.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "32px" }}>
          <button
            disabled={pagi.page === 1}
            onClick={() => fetchBookings(filter, pagi.page - 1)}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: pagi.page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 16px", cursor: pagi.page === 1 ? "default" : "pointer" }}
          >
            ← Trước
          </button>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Trang {pagi.page} / {pagi.totalPages}</span>
          <button
            disabled={pagi.page >= pagi.totalPages}
            onClick={() => fetchBookings(filter, pagi.page + 1)}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: pagi.page >= pagi.totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 16px", cursor: pagi.page >= pagi.totalPages ? "default" : "pointer" }}
          >
            Sau →
          </button>
        </div>
      )}

      {/* 4. MODAL CHI TIẾT BOOKING (Gọi từ file component độc lập của bạn) */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={(b) => setBookingToCancel(b)}
        />
      )}

      {/* 5. DIALOG XÁC NHẬN HỦY LỊCH (Gọi từ file component độc lập của bạn) */}
      {bookingToCancel && (
        <CancelConfirmDialog
          booking={bookingToCancel}
          isLoading={isCancelling}
          onConfirm={handleCancelConfirm}
          onClose={() => setBookingToCancel(null)}
        />
      )}
    </div>
  );
}