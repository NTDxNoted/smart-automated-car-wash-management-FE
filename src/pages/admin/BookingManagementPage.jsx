import { useState, useEffect } from "react";
import BookingTable from "../../components/admin/BookingTable";
import BookingDetailDrawer from "../../components/admin/BookingDetailDrawer";
import adminBookingService from "../../services/adminBookingService";

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    keyword: "",
    page: 1,
    pageSize: 10,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.getAll(filters);
      // Giả sử API trả về data.items và data.total
      const items = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];
      const total = res.data?.data?.total || res.data?.total || items.length;
      
      setBookings(Array.isArray(items) ? items : []);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / filters.pageSize) || 1);
    } catch (error) {
      console.error("Lỗi lấy booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTER - No card wrapper, just sitting on the page background */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm"
            >
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
          </div>

          <div className="relative">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value, page: 1 })}
              className="bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Using a search button to match Figma */}
          <div className="relative">
            <input
                type="text"
                placeholder="Search keyword..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })}
                className="bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm w-64"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE AND PAGINATION WRAPPED IN CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <BookingTable
          bookings={bookings}
          loading={loading}
          onRowClick={setSelectedBooking}
        />

        {/* PAGINATION */}
        <div className="border-t border-slate-100 p-4 flex items-center justify-between text-sm text-slate-500">
          <div>
            Hiển thị <span className="font-medium text-slate-700">{(filters.page - 1) * filters.pageSize + (bookings.length > 0 ? 1 : 0)}</span> đến <span className="font-medium text-slate-700">{Math.min(filters.page * filters.pageSize, totalItems)}</span> trong <span className="font-medium text-slate-700">{totalItems}</span> kết quả
          </div>
          
          <div className="flex items-center gap-4">
            <span>Trang {filters.page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="material-symbols-outlined text-sm mr-1">chevron_left</span> Trước
              </button>
              <button 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages || totalPages === 0}
                className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={fetchBookings}
      />
    </div>
  );
}
