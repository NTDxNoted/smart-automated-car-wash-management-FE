import { useEffect, useState } from "react";
import WeeklyOccupancyChart from "../../components/admin/WeeklyOccupancyChart";
import HourlyOccupancyChart from "../../components/admin/HourlyOccupancyChart";
import { getPeakOccupancy } from "../../services/adminReportService";
import "./ReportPage.css";

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

export default function OccupancyReportPage() {
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [data, setData] = useState({ weekly: [], hourly: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPeakOccupancy(startDate, endDate, { signal: controller.signal });
        setData(res || { weekly: [], hourly: [] });
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          console.error(err);
          setError("Không thể tải báo cáo tần suất hoạt động. Vui lòng kiểm tra kết nối API.");
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

  const hasData = (data.weekly && data.weekly.length > 0) || (data.hourly && data.hourly.length > 0);

  return (
    <div className="report-page-container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="report-page-title">Báo Cáo Khung Giờ Cao Điểm</h2>
          <p className="report-page-subtitle">
            Phân tích tỷ lệ lấp đầy theo thứ trong tuần và theo khung giờ hoạt động hàng ngày
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
          <p className="report-loading-text">Đang phân tích dữ liệu khung giờ...</p>
        </div>
      ) : error ? (
        <div className="report-loading-wrapper">
          <div className="text-red-500 mb-2 font-semibold">⚠️ Lỗi</div>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      ) : !hasData ? (
        <div className="report-loading-wrapper">
          <p className="report-loading-text">No bookings found during the selected period.</p>
        </div>
      ) : (
        <div className="space-y-6 flex flex-col gap-6">
          <div className="report-charts-grid">
            <WeeklyOccupancyChart data={data.weekly || []} />
            <HourlyOccupancyChart data={data.hourly || []} />
          </div>
        </div>
      )}
    </div>
  );
}
