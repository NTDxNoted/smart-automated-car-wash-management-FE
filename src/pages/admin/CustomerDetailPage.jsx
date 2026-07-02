import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CustomerDetailPanel from '../../components/admin/CustomerDetailPanel';
import LockToggleButton from '../../components/admin/LockToggleButton';
import { getCustomerDetail, toggleLock } from '../../services/adminCustomerService';
import './CustomerDetailPage.css';

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [lockLoading, setLockLoading] = useState(false);

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

  if (!customer) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-[#BCC8CE] shadow-sm">
        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  const bookingHistory = customer.bookingHistory || [];

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

        <CustomerDetailPanel customer={customer} />
      </div>

      <div className="detail-card">
        <h3 className="detail-card-subtitle">Lịch sử booking</h3>

        {bookingHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl font-medium">
            Chưa có lịch sử đặt lịch (booking) của khách hàng này.
          </div>
        ) : (
          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Dịch vụ</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
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
                      <td style={{ fontWeight: '600' }}>#{bId}</td>
                      <td>{booking.serviceName || booking.service?.serviceName || "Rửa xe cơ bản"}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <span className={getBookingStatusBadge(booking.status)}>
                          {getBookingStatusText(booking.status)}
                        </span>
                      </td>
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