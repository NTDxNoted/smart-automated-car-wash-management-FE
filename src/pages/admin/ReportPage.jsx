import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import OverviewChart from "../../components/admin/OverviewChart";
import RfmTable from "../../components/admin/RfmTable";
import TierDistributionChart from "../../components/admin/TierDistributionChart";
import LoyaltyStatsPanel from "../../components/admin/LoyaltyStatsPanel";
import BookingStatusPieChart from "../../components/admin/BookingStatusPieChart";

import {
  getOverviewReport,
  getRfmReport,
  getTierDistribution,
  getLoyaltyStats,
  getPopularServicesReport,
} from "../../services/adminReportService";
import "./ReportPage.css";

export default function ReportPage() {
  const [overview, setOverview] = useState(null);
  const [popularServices, setPopularServices] = useState([]);
  const [rfm, setRfm] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);

  // Date Filtering states
  const [filterType, setFilterType] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        const params = {
          filterType: "month",
          signal: controller.signal
        };
        const [overviewData, popularData, rfmData, tierData, loyaltyData] = await Promise.all([
          getOverviewReport(params),
          getPopularServicesReport(params),
          getRfmReport({ signal: controller.signal }),
          getTierDistribution({ signal: controller.signal }),
          getLoyaltyStats({ signal: controller.signal }),
        ]);

        if (!isMounted) return;

        setOverview(overviewData);
        setPopularServices(popularData);
        setRfm(rfmData);
        setTiers(tierData);
        setLoyalty(loyaltyData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleFilterSubmit = async () => {
    try {
      setFiltering(true);
      const params = {
        filterType: filterType === "custom" ? undefined : filterType,
        startDate: filterType === "custom" && startDate ? startDate : undefined,
        endDate: filterType === "custom" && endDate ? endDate : undefined,
      };

      const [overviewData, popularData] = await Promise.all([
        getOverviewReport(params),
        getPopularServicesReport(params),
      ]);

      setOverview(overviewData);
      setPopularServices(popularData);
    } catch (error) {
      console.error("Lỗi khi lọc dữ liệu báo cáo:", error);
    } finally {
      setFiltering(false);
    }
  };

  const [activeTab, setActiveTab] = useState("overview");

  if (!overview || !loyalty) {
    return (
      <div className="report-loading-wrapper">
        <div className="report-spinner"></div>
        <p className="report-loading-text">Đang tải báo cáo thống kê...</p>
      </div>
    );
  }

  // Map backend flat values for Overview charts
  const revenueTrend = [
    { month: overview.period || "Kỳ này", revenue: overview.totalRevenue }
  ];

  const bookingStatusData = [
    { name: "Completed", value: overview.completedBookings },
    { name: "Failed", value: overview.failedBookings },
    { name: "NoShow", value: overview.noShowBookings },
    { name: "Cancelled", value: overview.cancelledBookings },
  ].filter(item => item.value > 0);

  return (
    <div className="report-page-container">
      {/* Title Header */}
      <div>
        <h2 className="report-page-title">Báo cáo & Phân tích</h2>
        <p className="report-page-subtitle">
          Theo dõi tổng quan vận hành, số liệu Loyalty và bảng dữ liệu khách hàng RFM
        </p>
      </div>

      {/* Date Filter Bar */}
      <div className="report-filter-bar">
        <div className="report-filter-group">
          <span className="report-filter-label">Khung thời gian:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="report-filter-select"
          >
            <option value="month">Tháng này</option>
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="year">Năm nay</option>
            <option value="custom">Tùy chọn khoảng ngày</option>
          </select>

          {filterType === "custom" && (
            <div className="report-filter-group" style={{ marginLeft: '12px' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="report-filter-date"
              />
              <span style={{ color: '#64748B' }}>đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="report-filter-date"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleFilterSubmit}
          disabled={filtering}
          className="report-filter-btn"
        >
          {filtering ? "Đang lọc..." : "Áp dụng"}
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="report-tabs-bar">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "popular", label: "Dịch vụ phổ biến", icon: "🔥" },
          { id: "rfm", label: "Phân tích RFM", icon: "🧠" },
          { id: "tiers", label: "Tier Distribution", icon: "👑" },
          { id: "loyalty", label: "Loyalty Stats", icon: "💎" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`report-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="report-stats-grid">
            <SummaryCard
              title="Tổng doanh thu"
              value={`${overview.totalRevenue?.toLocaleString()} VNĐ`}
            />
            <SummaryCard
              title="Tổng số Bookings"
              value={overview.totalBookings?.toLocaleString()}
            />
            <SummaryCard
              title="Tổng số Customers"
              value={rfm.length?.toLocaleString()}
            />
          </div>

          <div className="report-charts-grid">
            <OverviewChart data={revenueTrend} />
            <BookingStatusPieChart data={bookingStatusData} />
          </div>
        </div>
      )}

      {activeTab === "popular" && (
        <div className="transition-all">
          <PopularServicesPanel data={popularServices} />
        </div>
      )}

      {activeTab === "rfm" && (
        <div className="transition-all">
          <RfmTable data={rfm} />
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="transition-all">
          <TierDistributionChart data={tiers} />
        </div>
      )}

      {activeTab === "loyalty" && (
        <div className="transition-all">
          <LoyaltyStatsPanel stats={loyalty} />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="report-stat-card">
      <span className="report-stat-label">{title}</span>
      <h3 className="report-stat-value">
        {value}
      </h3>
    </div>
  );
}

function PopularServicesPanel({ data }) {
  const chartData = data.map(item => ({
    name: item.serviceName,
    value: item.usageCount
  }));

  const COLORS = ["#00677F", "#10B981", "#F59E0B", "#EF4444", "#6B21A8", "#64748B"];

  return (
    <div className="popular-services-grid">
      {/* Pie Chart Card */}
      <div className="report-chart-card">
        <h3 className="report-chart-title">Phân bổ lượt sử dụng dịch vụ</h3>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748B' }}>
            Không có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" aspect={1.8}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                label={({ name, percent }) => `${name.slice(0, 12)}...: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #BCC8CE',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table Card */}
      <div className="popular-table-card">
        <h3 className="report-chart-title">Bảng thống kê chi tiết</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="popular-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Hạng</th>
                <th>Tên dịch vụ</th>
                <th>Số lượt đặt</th>
                <th>Doanh thu</th>
                <th>Tỷ lệ %</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  let rankClass = "rank-other";
                  if (index === 0) rankClass = "rank-1";
                  else if (index === 1) rankClass = "rank-2";
                  else if (index === 2) rankClass = "rank-3";

                  return (
                    <tr key={item.serviceId}>
                      <td>
                        <span className={`popular-rank-badge ${rankClass}`}>{index + 1}</span>
                      </td>
                      <td style={{ fontWeight: '500', color: '#1E293B' }}>{item.serviceName}</td>
                      <td>{item.usageCount}</td>
                      <td style={{ fontWeight: '600', color: '#111C2C' }}>
                        {item.totalRevenue?.toLocaleString()} VNĐ
                      </td>
                      <td>{item.percentage}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
