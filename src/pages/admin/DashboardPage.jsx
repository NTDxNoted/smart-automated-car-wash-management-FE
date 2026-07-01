import { useEffect, useState } from "react";
import adminBookingService from "../../services/adminBookingService";

export default function DashboardPage() {
  const stats = [
    {
      title: 'Booking hôm nay',
      value: 28,
      icon: '📅',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Doanh thu',
      value: '12.4M',
      icon: '💰',
      color: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Đang Pending',
      value: 6,
      icon: '🕒',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'No-show',
      value: 2,
      icon: '⚠️',
      color: 'from-red-500 to-pink-600'
    }
  ];

  // const recentBookings = [
  //   {
  //     id: '#BK001',
  //     customer: 'Nguyễn Văn A',
  //     plate: '51H-12345',
  //     service: 'Premium Wash',
  //     status: 'Completed'
  //   },
  //   {
  //     id: '#BK002',
  //     customer: 'Trần Minh B',
  //     plate: '43A-88991',
  //     service: 'Interior Cleaning',
  //     status: 'Pending'
  //   },
  //   {
  //     id: '#BK003',
  //     customer: 'Lê Quốc C',
  //     plate: '30F-22211',
  //     service: 'Full Combo',
  //     status: 'Cancelled'
  //   }
  // ];

  const [recentBookings, setRecentBookings] = useState([]);
const [loadingBookings, setLoadingBookings] = useState(false);

useEffect(() => {
  const fetchRecentBookings = async () => {
    try {
      setLoadingBookings(true);

      const res = await adminBookingService.getAll({
        page: 1,
        pageSize: 5,
      });

      const data =
        res.data?.data?.items ||
        res.data?.items ||
        res.data?.data ||
        res.data ||
        [];

      setRecentBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy booking:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  fetchRecentBookings();
}, []);

  const getStatusStyle = (status) => {
    switch (status) {
    case 'Completed':
      return 'bg-[#D8E3FA] text-[#3D494D]';
    case 'Processing':
    case 'Pending':
      return 'bg-[#00A9CE] text-[#003846]';
    case 'Cancelled':
      return 'bg-[#FFDAD6] text-[#BA1A1A]';
    default:
      return 'bg-[#D8E3FA] text-[#3D494D]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard vận hành
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Tổng quan hệ thống rửa xe hôm nay
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-[#0c0f24] border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h3 className="text-3xl font-bold text-white mt-3">
                  {item.value}
                </h3>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-xl`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="xl:col-span-2 bg-[#0c0f24] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">
                Doanh thu tuần này
              </h3>

              <p className="text-slate-400 text-sm">
                Tổng quan doanh thu 7 ngày gần nhất
              </p>
            </div>
          </div>

          {/* Fake Chart */}
          <div className="h-64 flex items-end gap-3">
            {[40, 65, 55, 80, 50, 95, 75].map((height, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col justify-end items-center gap-2"
              >
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-blue-500"
                  style={{
                    height: `${height}%`
                  }}
                />

                <span className="text-xs text-slate-500">
                  T{index + 2}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-[#0c0f24] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-6">
            Trạng thái nhanh
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-slate-400 text-sm">
                Xe đang xử lý
              </p>

              <h4 className="text-2xl font-bold text-cyan-400 mt-2">
                14
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-slate-400 text-sm">
                Nhân viên online
              </p>

              <h4 className="text-2xl font-bold text-emerald-400 mt-2">
                8
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-slate-400 text-sm">
                Tỉ lệ hoàn thành
              </p>

              <h4 className="text-2xl font-bold text-yellow-400 mt-2">
                92%
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#0c0f24] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-white text-lg font-bold">
            Booking gần đây
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr className="text-left text-slate-400 text-sm">
                <th className="px-6 py-4">Mã</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Biển số</th>
                <th className="px-6 py-4">Dịch vụ</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  // key={booking.id}
                  key={booking.bookingId || booking.id}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {/* {booking.id} */}
                    #{booking.bookingId || booking.id}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {/* {booking.customer} */}
                    {booking.customerName || booking.customer?.fullName || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {/* {booking.plate} */}
                    {booking.licensePlate || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {/* {booking.service} */}
                    {booking.serviceName || booking.service?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
