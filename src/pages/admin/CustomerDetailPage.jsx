import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import CustomerDetailPanel from '../../components/admin/CustomerDetailPanel';
import LockToggleButton from '../../components/admin/LockToggleButton';
import { getCustomerDetail, toggleLock, updateNotes } from '../../services/adminCustomerService';
import './CustomerDetailPage.css';

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const paymentLabel = (method) => {
  const upper = (method || '').toUpperCase();
  if (upper === 'CASH') return 'Tiền mặt';
  if (upper === 'TRANSFER') return 'Chuyển khoản';
  return 'Chưa thanh toán';
};

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [lockLoading, setLockLoading] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const data = await getCustomerDetail(id);
      setCustomer(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (notes) => {
    if (savingNotes) return;
    try {
      setSavingNotes(true);
      const data = await updateNotes(id, notes);
      setCustomer((prev) => ({ ...prev, adminNotes: data?.adminNotes ?? notes }));
    } catch (err) {
      console.error(err);
      alert('Không thể lưu ghi chú');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleToggleLock = async () => {
    if (lockLoading) return;

    const isCurrentlyLocked = customer.isLocked || customer.status === 'LOCKED';
    const confirmMessage = isCurrentlyLocked
      ? `Bạn có chắc chắn muốn mở khóa tài khoản của khách hàng ${customer.fullName || ''}?`
      : `Bạn có chắc chắn muốn khóa tài khoản của khách hàng ${customer.fullName || ''}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setLockLoading(true);

      const data = await toggleLock(id);

      setCustomer((prev) => {
        const isPrevLocked = prev.isLocked || prev.status === 'LOCKED';
        const newLocked =
          typeof data?.isLocked === 'boolean'
            ? data.isLocked
            : !isPrevLocked;
        return {
          ...prev,
          isLocked: newLocked,
          status: newLocked ? 'LOCKED' : 'ACTIVE',
        };
      });
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái tài khoản');
    } finally {
      setLockLoading(false);
    }
  };

  const getBookingStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "booking-status-capsule completed";
      case "PENDING":
        return "booking-status-capsule pending";
      case "FAILED":
        return "booking-status-capsule failed";
      case "CANCELLED":
        return "booking-status-capsule cancelled";
      case "NOSHOW":
        return "booking-status-capsule failed";
      default:
        return "booking-status-capsule pending";
    }
  };

  const getBookingStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "Hoàn thành";
      case "PENDING":
        return "Chờ xử lý";
      case "FAILED":
        return "Thất bại";
      case "CANCELLED":
        return "Đã hủy";
      case "NOSHOW":
        return "Vắng mặt";
      default:
        return status || "Chờ xử lý";
    }
  };

  const bookingHistory = customer?.bookingHistory || [];

  const summary = useMemo(() => {
    let noShowCancel = 0;
    bookingHistory.forEach((b) => {
      const s = (b.status || '').toUpperCase();
      if (s === 'CANCELLED' || s === 'FAILED' || s === 'NOSHOW') noShowCancel++;
    });
    return {
      usageCount: bookingHistory.length,
      totalRevenue: customer?.totalSpending || 0,
      noShowCancel,
    };
  }, [bookingHistory, customer?.totalSpending]);

  if (!customer) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-[#BCC8CE] shadow-sm">
        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      <Link to="/admin/customers" className="back-link-wrapper">
        <span>←</span> Quay lại danh sách
      </Link>

      <div className="detail-card">
        <div className="detail-card-header">
          <h2 className="detail-card-title">Chi tiết khách hàng</h2>

          <LockToggleButton
            isLocked={customer.isLocked || customer.status === 'LOCKED'}
            loading={lockLoading}
            onClick={handleToggleLock}
          />
        </div>

        <CustomerDetailPanel customer={customer} onSaveNotes={handleSaveNotes} savingNotes={savingNotes} />
      </div>

      <div className="detail-card">
        <h3 className="detail-card-subtitle">Lịch sử booking</h3>

        <div className="booking-summary-row">
          <div className="booking-summary-item">
            <span className="booking-summary-label">Tổng số lần dùng dịch vụ</span>
            <span className="booking-summary-value">{summary.usageCount}</span>
          </div>
          <div className="booking-summary-item">
            <span className="booking-summary-label">Tổng doanh thu mang lại</span>
            <span className="booking-summary-value net">{formatVnd(summary.totalRevenue)}</span>
          </div>
          <div className="booking-summary-item">
            <span className="booking-summary-label">No-show / Hủy lịch</span>
            <span className="booking-summary-value danger">{summary.noShowCancel}</span>
          </div>
        </div>

        {bookingHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl font-medium">
            Chưa có lịch sử đặt lịch (booking) của khách hàng này.
          </div>
        ) : (
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Mã hóa đơn</th>
                  <th>Mã</th>
                  <th>Dịch vụ</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Khuyến mãi</th>
                  <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                </tr>
              </thead>

              <tbody>
                {bookingHistory.map((booking) => {
                  const bDate = booking.bookingDate || booking.scheduledTime || booking.createdAt;
                  const formattedDate = bDate ? new Date(bDate).toLocaleDateString("vi-VN") : "-";
                  const price = booking.totalAmount || booking.finalAmount || booking.totalPrice || 0;
                  const bId = booking.bookingId || booking.bookingID || booking.id;

                  return (
                    <tr key={bId}>
                      <td>{booking.invoiceCode || '-'}</td>
                      <td style={{ fontWeight: '600' }}>#{bId}</td>
                      <td>{booking.serviceName || booking.service?.serviceName || "Rửa xe cơ bản"}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <span className={getBookingStatusBadge(booking.status)}>
                          {getBookingStatusText(booking.status)}
                        </span>
                      </td>
                      <td>{paymentLabel(booking.paymentMethod)}</td>
                      <td>{booking.promotionApplied || '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>
                        {price.toLocaleString()}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}