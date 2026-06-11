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

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    const data = await getCustomerDetail(id);
    setCustomer(data);
  };

  const handleToggleLock = async () => {
    const ok = window.confirm(
      'Bạn có chắc muốn thay đổi trạng thái tài khoản?'
    );

    if (!ok) return;

    await toggleLock(id);

    setCustomer((prev) => ({
      ...prev,
      isLocked: !prev.isLocked,
    }));
  };

  if (!customer) return null;

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
            onClick={handleToggleLock}
          />
        </div>

        <CustomerDetailPanel customer={customer} />
      </div>

      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
        <h3 className="font-semibold mb-4">
          Lịch sử booking
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Mã</th>
              <th className="text-left">Dịch vụ</th>
              <th className="text-left">Ngày</th>
              <th className="text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {customer.bookingHistory?.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.serviceName}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}