import { useState, useEffect, useCallback } from "react";
// ĐÃ SỬA: Import đúng object bookingService được export từ file service chung của nhóm
import { bookingService } from "../../services/bookingService";
import BookingCard from "../../components/booking/BookingCard";
import BookingDetailModal from "../../components/booking/BookingDetailModal";
import CancelConfirmDialog from "../../components/booking/CancelConfirmDialog";
import { useLanguage } from "../../context/LanguageContext";

export default function BookingHistoryPage() {
  const { t } = useLanguage();
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

    // 🔍 CHÈN LOG KIỂM TRA LUỒNG:
    console.log("=== FLOW: Trang Lịch sử bắt đầu gọi API lấy dữ liệu ===");

    try {
      const apiStatus = statusFilter === "Tất cả" ? "all" : statusFilter;
      const response = await bookingService.getMyBookings({
        status: apiStatus,
        page: pageNum,
        pageSize: 5
      });

      console.log("✅ API lấy lịch sử thành công, dữ liệu nhận được:", response);
      setBookings(response?.data || []);
      setPagi({
        page: response?.pagination?.page || pageNum,
        totalPages: response?.pagination?.totalPages || 1,
      });
    } catch (err) {
      console.error("Lỗi khi tải lịch sử booking:", err);
      setErrorMsg(t('errHistoryLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Tự động gọi lại hàm fetch mỗi khi người dùng đổi Tab Filter
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
      alert(t('cancelSuccessMsg').replace('{points}', res.pointsRefunded));

      // Đóng các modal và dialog sau khi xử lý thành công
      setBookingToCancel(null);
      setSelectedBooking(null);

      // KÍCH HOẠT RELOAD DANH SÁCH: Tải lại trang hiện tại để cập nhật trạng thái mới nhất
      fetchBookings(filter, pagi.page);
    } catch (err) {
      console.error("Lỗi khi hủy đặt lịch:", err);
      const serverCode = err?.response?.data?.code;
      if (serverCode === "CANCELLATION_TIME_EXCEEDED") {
        alert(t('cancelTimeExceeded'));
      } else {
        alert(t('cancelGenericError'));
      }
    } finally {
      setIsCancelling(false);
    }
  };

  // ─── Danh sách các Tab trạng thái theo thiết kế đặc tả ──────────────────────
  const TABS = ["Tất cả", "Pending", "Completed", "Cancelled", "Failed", "No-show"];

  const getTabLabel = (tab) => {
    switch (tab) {
      case "Tất cả": return t('historyStatusTabAll');
      case "Pending": return t('statusPending');
      case "Completed": return t('statusCompleted');
      case "Cancelled": return t('statusCancelled');
      case "Failed": return t('statusFailed');
      case "No-show": return t('statusNoShow');
      default: return tab;
    }
  };

  return (
    <div className="booking-history-container">
      <style>{`
        .booking-history-container {
          padding: 40px 24px 80px 24px !important;
          max-width: 900px !important;
          margin: 0 auto !important;
          min-height: 100vh !important;
          color: #0f172a !important;
          box-sizing: border-box !important;
        }
        @media (max-width: 640px) {
          .booking-history-container {
            padding: 24px 16px 80px 16px !important;
          }
        }
      `}</style>

      {/* 💡 HỘP ĐỆM TÀNG HÌNH: Chỉ chiếm diện tích lúc đầu để đẩy chữ xuống, khi cuộn trang nó sẽ trượt lên và biến mất */}
      <div className="h-16 w-full block" aria-hidden="true"></div>

      <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "28px", fontWeight: 700, color: "#0891b2", marginBottom: "24px" }}>
        {t('historyTitle')}
      </h1>

      {/* 1. Thanh Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: "12px", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: filter === tab ? "rgba(8, 145, 178, 0.4)" : "transparent",
              background: filter === tab ? "rgba(8, 145, 178, 0.1)" : "transparent",
              color: filter === tab ? "#0891b2" : "rgba(0,0,0,0.6)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Giao diện Trạng thái Loading hoặc báo lỗi */}
      {isLoading && <div style={{ textAlign: "center", padding: "40px", color: "rgba(0,0,0,0.5)" }}>{t('loadingHistory')}</div>}
      {errorMsg && <div style={{ color: "#FF5C5C", padding: "20px", background: "rgba(255,92,92,0.05)", borderRadius: "8px", marginBottom: "20px" }}>{errorMsg}</div>}

      {/* 2. Danh sách hiển thị các Booking Card */}
      {!isLoading && !errorMsg && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "14px", border: "1px dashed rgba(0,0,0,0.2)", color: "rgba(0,0,0,0.5)" }}>
              {t('emptyHistory')}
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
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: "13px", color: pagi.page === 1 ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "8px 16px", cursor: pagi.page === 1 ? "default" : "pointer" }}
          >
            ← {t('btnPrev')}
          </button>
          <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)" }}>{t('pageLabel').replace('{page}', pagi.page).replace('{totalPages}', pagi.totalPages)}</span>
          <button
            disabled={pagi.page >= pagi.totalPages}
            onClick={() => fetchBookings(filter, pagi.page + 1)}
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: "13px", color: pagi.page >= pagi.totalPages ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "8px 16px", cursor: pagi.page >= pagi.totalPages ? "default" : "pointer" }}
          >
            {t('btnNext')} →
          </button>
        </div>
      )}

      {/* 4. MODAL CHI TIẾT BOOKING */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={(b) => setBookingToCancel(b)}
        />
      )}

      {/* 5. DIALOG XÁC NHẬN HỦY LỊCH */}
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