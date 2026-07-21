import { useEffect, useState } from "react";
import PopularServicesChart from "../../components/admin/PopularServicesChart";
import PopularServicesTable from "../../components/admin/PopularServicesTable";
import { getPopularServices } from "../../services/adminReportService";
import "./ReportPage.css"; // Reuse the general report styling classes

const getFirstDayOfMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PopularServicesReportPage() {
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPopularServices(startDate, endDate, { signal: controller.signal });
        setData(res || []);
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          console.error(err);
          setError("Không thể tải báo cáo dịch vụ. Vui lòng kiểm tra kết nối API.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [startDate, endDate]);

  return (
    <div className="report-page-container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="report-page-title">Báo cáo Dịch vụ Phổ biến</h2>
          <p className="report-page-subtitle">
            Phân tích tỷ lệ lượt rửa xe và đóng góp doanh thu của các dịch vụ
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-3">
          <div className="booking-date-wrapper" style={{ width: "160px" }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="booking-date-input"
              style={{ width: "160px" }}
            />
          </div>
          <span className="text-slate-400 text-sm">đến</span>
          <div className="booking-date-wrapper" style={{ width: "160px" }}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="booking-date-input"
              style={{ width: "160px" }}
            />
          </div>
        </div>
      </div>

      {/* Main Page Area */}
      {loading ? (
        <div className="report-loading-wrapper">
          <div className="report-spinner"></div>
          <p className="report-loading-text">Đang phân tích số liệu dịch vụ...</p>
        </div>
      ) : error ? (
        <div className="report-loading-wrapper">
          <div className="text-red-500 mb-2 font-semibold">⚠️ Lỗi</div>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="report-loading-wrapper">
          <p className="report-loading-text">No bookings found during the selected period.</p>
        </div>
      ) : (
        <div className="space-y-6 flex flex-col gap-6">
          {/* Charts view */}
          <div className="report-charts-grid" style={{ gridTemplateColumns: "1fr" }}>
            <PopularServicesChart data={data} />
          </div>

          {/* Table view */}
          <PopularServicesTable data={data} />
        </div>
      )}
    </div>
  );
}
