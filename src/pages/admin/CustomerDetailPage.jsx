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

  if (!customer) {
    return (
      <div className="text-slate-400">
        Đang tải thông tin khách hàng...
      </div>
    );
  }

  const bookingHistory = customer.bookingHistory || [];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/customers"
        className="text-cyan-400"
      >
        ← Quay lại
      </Link>

      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">
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

      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
        <h3 className="font-semibold mb-4">
          Lịch sử booking
        </h3>

        {bookingHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-400 border border-dashed border-white/10 rounded-xl">
            Chưa có lịch sử booking
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-left py-3">Mã</th>
                <th className="text-left py-3">Dịch vụ</th>
                <th className="text-left py-3">Ngày</th>
                <th className="text-left py-3">Trạng thái</th>
                <th className="text-left py-3">Tổng tiền</th>
                <th className="text-left py-3">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {bookingHistory.map((booking) => {
                const isCompleted = booking.status === 'Completed';

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-white/5"
                  >
                    <td className="py-3">{booking.id}</td>
                    <td>{booking.serviceName}</td>
                    <td>{booking.bookingDate}</td>
                    <td>{booking.status}</td>
                    <td>{booking.totalAmount || booking.totalPrice || 0}</td>
                    <td>
                      {!isCompleted ? (
                        <button
                          type="button"
                          className="text-cyan-400 hover:underline"
                        >
                          Sửa tài chính
                        </button>
                      ) : (
                        <span className="text-slate-500">
                          Đã hoàn tất
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}