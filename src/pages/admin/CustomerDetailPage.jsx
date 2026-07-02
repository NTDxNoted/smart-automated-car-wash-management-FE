import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CustomerDetailPanel from '../../components/admin/CustomerDetailPanel';
import LockToggleButton from '../../components/admin/LockToggleButton';

import {
  getCustomerDetail,
  toggleLock,
} from '../../services/adminCustomerService';

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

    const ok = window.confirm(
      'Bạn có chắc muốn thay đổi trạng thái tài khoản?'
    );

    if (!ok) return;

    try {
      setLockLoading(true);

      const data = await toggleLock(id);

      setCustomer((prev) => ({
        ...prev,
        isLocked:
          typeof data?.isLocked === 'boolean'
            ? data.isLocked
            : !prev.isLocked,
        status:
          typeof data?.isLocked === 'boolean'
            ? data.isLocked
              ? 'LOCKED'
              : 'ACTIVE'
            : prev.isLocked
              ? 'ACTIVE'
              : 'LOCKED',
      }));
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
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs font-semibold";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded text-xs font-semibold";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs font-semibold";
      case "CANCELLED":
        return "bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2 py-1 rounded text-xs font-semibold";
      case "NOSHOW":
        return "bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-1 rounded text-xs font-semibold";
      default:
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded text-xs font-semibold";
    }
  };

  if (!customer) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5">
        <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  const bookingHistory = customer.bookingHistory || [];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/customers"
        className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 font-semibold text-sm transition"
      >
        <span>←</span> Quay lại danh sách
      </Link>

      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Chi tiết khách hàng
          </h2>

          <LockToggleButton
            isLocked={customer.isLocked}
            loading={lockLoading}
            onClick={handleToggleLock}
          />
        </div>

        <CustomerDetailPanel customer={customer} />
      </div>

      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="font-semibold text-white mb-4 text-lg">
          Lịch sử booking
        </h3>

        {bookingHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-450 border border-dashed border-white/10 rounded-2xl">
            Chưa có lịch sử booking
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold bg-white/[0.01]">
                  <th className="text-left px-4 py-3">Mã</th>
                  <th className="text-left px-4 py-3">Dịch vụ</th>
                  <th className="text-left px-4 py-3">Ngày</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-right px-4 py-3">Tổng tiền</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {bookingHistory.map((booking) => {
                  const bDate = booking.bookingDate || booking.scheduledTime || booking.createdAt;
                  const formattedDate = bDate ? new Date(bDate).toLocaleDateString("vi-VN") : "-";
                  const price = booking.totalAmount || booking.finalAmount || booking.totalPrice || 0;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-white/[0.01] transition"
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-200">{booking.id}</td>
                      <td className="px-4 py-3.5 text-slate-300">{booking.serviceName || "Rửa xe cơ bản"}</td>
                      <td className="px-4 py-3.5 text-slate-350">{formattedDate}</td>
                      <td className="px-4 py-3.5">
                        <span className={getBookingStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-200">
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