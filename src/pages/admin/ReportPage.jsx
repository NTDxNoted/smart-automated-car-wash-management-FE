import { useEffect, useState, useMemo } from "react";

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
} from "../../services/adminReportService";
import adminBookingService from "../../services/adminBookingService";
import "./ReportPage.css";

export default function ReportPage() {
  const [overview, setOverview] = useState(null);
  const [rfm, setRfm] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  
  // Dynamic Bookings Data
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date Range Filters
  const [dateRangeType, setDateRangeType] = useState("7days"); // today, 7days, month, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // RFM segment filter from cards
  const [selectedRfmSegment, setSelectedRfmSegment] = useState("");
  const [activeTab, setActiveTab] = useState("overview_rfm");

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [overviewData, rfmData, tierData, loyaltyData, bookingsRes] = await Promise.all([
          getOverviewReport({ signal: controller.signal }),
          getRfmReport({ signal: controller.signal }),
          getTierDistribution({ signal: controller.signal }),
          getLoyaltyStats({ signal: controller.signal }),
          adminBookingService.getAll({ pageSize: 1000 })
        ]);

        if (!isMounted) return;

        setOverview(overviewData);
        setRfm(rfmData);
        setTiers(tierData);
        setLoyalty(loyaltyData);

        const bookingsList = bookingsRes.data?.data || bookingsRes.data || [];
        const mappedBookings = bookingsList.map(b => ({
          id: b.bookingID ?? b.bookingId ?? b.id,
          customerName: b.customerName ?? b.phone ?? "Vãng lai",
          phone: b.phone,
          licensePlate: b.licensePlate,
          status: b.status,
          totalAmount: Number(b.finalAmount ?? b.baseAmount ?? b.totalAmount ?? b.totalPrice ?? 0),
          scheduledTime: b.scheduledTime,
          serviceName: b.serviceName ?? 'Rửa Xe'
        }));
        setAllBookings(mappedBookings);
      } catch (error) {
        if (error.name !== "AbortError" && error.name !== "CanceledError") {
          console.error(error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Filter Bookings by Date Range
  const filteredBookings = useMemo(() => {
    if (allBookings.length === 0) return [];
    
    const now = new Date();
    let start = new Date();
    let end = new Date();
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    if (dateRangeType === "today") {
      // today only
    } else if (dateRangeType === "7days") {
      start.setDate(now.getDate() - 6);
    } else if (dateRangeType === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRangeType === "custom") {
      if (customStartDate) {
        start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
      }
      if (customEndDate) {
        end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
      }
    }
    
    return allBookings.filter(b => {
      if (!b.scheduledTime) return false;
      const bDate = new Date(b.scheduledTime);
      return bDate >= start && bDate <= end;
    });
  }, [allBookings, dateRangeType, customStartDate, customEndDate]);

  // Aggregate period-specific KPI stats
  const kpis = useMemo(() => {
    const total = filteredBookings.length;
    const completedList = filteredBookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
    const revenue = completedList.reduce((sum, b) => sum + b.totalAmount, 0);
    
    const uniqueCusts = new Set();
    const custCounts = {};
    filteredBookings.forEach(b => {
      const key = b.phone || b.customerName;
      if (key) {
        uniqueCusts.add(key);
        custCounts[key] = (custCounts[key] || 0) + 1;
      }
    });
    const customers = uniqueCusts.size;
    
    const completedCount = completedList.length;
    const completedRate = total > 0 ? (completedCount / total) * 100 : 0;
    
    const cancelNoShow = filteredBookings.filter(b => 
      ['CANCELLED', 'FAILED', 'NOSHOW', 'NO-SHOW', 'CANCEL_BY_ADMIN', 'CANCEL_BY_CUSTOMER'].includes(b.status?.toUpperCase())
    ).length;
    const cancelRate = total > 0 ? (cancelNoShow / total) * 100 : 0;
    
    const aov = completedCount > 0 ? revenue / completedCount : 0;
    
    const repeatCustomers = Object.values(custCounts).filter(count => count >= 2).length;
    const repeatRate = customers > 0 ? (repeatCustomers / customers) * 100 : 0;
    
    return {
      revenue,
      bookings: total,
      customers,
      completedRate,
      cancelRate,
      aov,
      repeatRate
    };
  }, [filteredBookings]);

  // Grouped Revenue trend chart data (by day or by month)
  const revenueChartData = useMemo(() => {
    const completed = filteredBookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
    const dataMap = {};
    
    let useMonth = false;
    let start = new Date();
    let end = new Date();
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    if (dateRangeType === "today") {
      // today only
    } else if (dateRangeType === "7days") {
      start.setDate(start.getDate() - 6);
    } else if (dateRangeType === "month") {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
    } else if (dateRangeType === "custom") {
      if (customStartDate) start = new Date(customStartDate);
      if (customEndDate) end = new Date(customEndDate);
      const diff = (end - start) / (1000 * 60 * 60 * 24);
      if (diff > 45) {
        useMonth = true;
      }
    }
    
    if (useMonth) {
      completed.forEach(b => {
        if (!b.scheduledTime) return;
        const d = new Date(b.scheduledTime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        dataMap[key] = (dataMap[key] || 0) + b.totalAmount;
      });
      
      return Object.keys(dataMap).sort().map(key => {
        const [year, month] = key.split('-');
        return {
          month: `${month}/${year}`,
          revenue: dataMap[key]
        };
      });
    } else {
      const cursor = new Date(start);
      cursor.setHours(0,0,0,0);
      const limit = new Date(end);
      limit.setHours(23,59,59,999);
      
      while (cursor <= limit) {
        const key = cursor.toLocaleDateString('en-CA');
        dataMap[key] = 0;
        cursor.setDate(cursor.getDate() + 1);
      }
      
      completed.forEach(b => {
        if (!b.scheduledTime) return;
        const d = new Date(b.scheduledTime);
        const key = d.toLocaleDateString('en-CA');
        if (dataMap[key] !== undefined) {
          dataMap[key] += b.totalAmount;
        }
      });
      
      return Object.keys(dataMap).sort().map(key => {
        const d = new Date(key);
        return {
          month: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          revenue: dataMap[key]
        };
      });
    }
  }, [filteredBookings, dateRangeType, customStartDate, customEndDate]);

  // Pie chart counts
  const bookingStatusPieData = useMemo(() => {
    const counts = {
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
      Failed: 0,
      'No-show': 0
    };
    
    filteredBookings.forEach(b => {
      const status = b.status?.toUpperCase();
      if (status === 'COMPLETED') counts.Completed++;
      else if (status === 'PENDING') counts.Pending++;
      else if (['CANCELLED', 'FAILED', 'CANCEL', 'CANCEL_BY_ADMIN', 'CANCEL_BY_CUSTOMER'].includes(status)) {
        if (status === 'FAILED') counts.Failed++;
        else counts.Cancelled++;
      } else if (['NOSHOW', 'NO-SHOW', 'NO_SHOW'].includes(status)) counts['No-show']++;
      else counts.Pending++;
    });
    
    return Object.keys(counts).map(name => ({
      name,
      value: counts[name]
    })).filter(item => item.value > 0);
  }, [filteredBookings]);

  // Popular Services counts
  const popularServicesData = useMemo(() => {
    const completed = filteredBookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
    const serviceMap = {};
    
    completed.forEach(b => {
      const name = b.serviceName || 'Rửa xe';
      if (!serviceMap[name]) {
        serviceMap[name] = { serviceName: name, totalWashes: 0, revenue: 0 };
      }
      serviceMap[name].totalWashes++;
      serviceMap[name].revenue += b.totalAmount;
    });
    
    const list = Object.values(serviceMap);
    const totalRev = list.reduce((sum, item) => sum + item.revenue, 0);
    
    return list.map(item => ({
      ...item,
      revenueContribution: totalRev > 0 ? (item.revenue / totalRev) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredBookings]);

  // RFM Insight counts over all-time RFM data
  const rfmMetrics = useMemo(() => {
    let championsCount = 0;
    let atRiskCount = 0;
    let newCount = 0;

    (rfm || []).forEach(row => {
      const r = Number(row.recency);
      const f = Number(row.frequency);
      const m = Number(row.monetary);

      // Champions: recency <= 5, frequency >= 15, monetary >= 3M
      if (r <= 5 && f >= 15 && m >= 3000000) {
        championsCount++;
      // At Risk: recency > 15 days, frequency >= 8
      } else if (r > 15 && f >= 8) {
        atRiskCount++;
      // New: recency <= 7 days, frequency <= 2
      } else if (r <= 7 && f <= 2) {
        newCount++;
      }
    });

    return { championsCount, atRiskCount, newCount };
  }, [rfm]);

  const handleSegmentClick = (segmentName) => {
    setSelectedRfmSegment(segmentName);
    const tableEl = document.getElementById("rfm-table-section");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="report-loading-wrapper">
        <div className="report-spinner"></div>
        <p className="report-loading-text">Đang tải báo cáo thống kê...</p>
      </div>
    );
  }

  return (
    <div className="report-page-container">
      {/* Title Header */}
      <div className="report-page-header">
        <h2 className="report-page-title">Báo cáo & Phân tích quản trị</h2>
        <p className="report-page-subtitle">
          Hỗ trợ ra quyết định kinh doanh, tiếp thị và theo dõi hiệu suất loyalty khách hàng
        </p>
      </div>

      {/* Tab Navigation & Filters */}
      <div className="report-nav-filter-bar">
        {/* Tabs Menu */}
        <div className="report-tabs-bar">
          {[
            { id: "overview_rfm", label: "TỔNG QUAN & RFM", icon: "📊" },
            { id: "tiers", label: "PHÂN BỔ HẠNG THÀNH VIÊN", icon: "👑" },
            { id: "loyalty", label: "THỐNG KÊ LOYALTY", icon: "💎" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`report-tab-btn cursor-pointer ${activeTab === tab.id ? "active" : ""}`}
            >
              <div className="tab-icon-container">
                <span className="tab-icon">{tab.icon}</span>
              </div>
              <span className="tab-text">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Date Filter Dropdown */}
        <div className="report-date-filter-wrapper">
          <div className="report-date-dropdown-container">
            <span className="report-date-dropdown-icon">📅</span>
            <select
              value={dateRangeType}
              onChange={(e) => setDateRangeType(e.target.value)}
              className="report-date-dropdown-select"
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {dateRangeType === 'custom' && (
            <div className="report-custom-date-inputs">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="report-custom-date-input"
              />
              <span className="report-custom-date-divider">đến</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="report-custom-date-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview_rfm" && (
        <div className="space-y-6">
          {/* Row 1 KPI Cards (4 cards) */}
          <div className="report-stats-grid-row1">
            <SummaryCard
              title="Tổng doanh thu"
              value={`${kpis.revenue.toLocaleString()}đ`}
              subtitle="Doanh thu thực nhận"
              cardClass="row1"
            />
            <SummaryCard
              title="Tổng bookings"
              value={kpis.bookings.toLocaleString()}
              subtitle="Lượt đặt dịch vụ"
              cardClass="row1"
            />
            <SummaryCard
              title="Tổng khách hàng"
              value={kpis.customers.toLocaleString()}
              subtitle="Khách hàng duy nhất"
              cardClass="row1"
            />
            <SummaryCard
              title="Tỷ lệ hoàn thành"
              value={`${kpis.completedRate.toFixed(1)}%`}
              subtitle="Rửa xe thành công"
              cardClass="row1"
            />
          </div>

          {/* Row 2 KPI Cards (3 cards) */}
          <div className="report-stats-grid-row2">
            <SummaryCard
              title="Tỷ lệ hủy / no-show"
              value={`${kpis.cancelRate.toFixed(1)}%`}
              subtitle="Hủy hoặc bỏ lỡ lịch"
              cardClass="row2"
            />
            <SummaryCard
              title="Đơn giá trung bình (AOV)"
              value={`${Math.round(kpis.aov).toLocaleString()}đ`}
              subtitle="Doanh thu / lượt completed"
              cardClass="row2"
            />
            <SummaryCard
              title="Tỷ lệ khách quay lại"
              value={`${kpis.repeatRate.toFixed(1)}%`}
              subtitle="Rửa xe từ 2 lần trở lên"
              cardClass="row2"
            />
          </div>

          {/* Charts Rows */}
          <div className="report-charts-grid">
            <OverviewChart data={revenueChartData} />
            <BookingStatusPieChart data={bookingStatusPieData} />
          </div>



          {/* Loyalty & RFM Insights Panel */}
          <div className="rfm-insights-section">
            <div className="rfm-insights-header">
              <span className="rfm-insights-header-text">💡 Đề xuất tiếp thị theo phân khúc (RFM Insights)</span>
            </div>

            <div className="rfm-insights-cards-container">
              {/* Champions (Khách VIP) */}
              <div 
                className="rfm-insight-card champions-card cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleSegmentClick("Champions")}
              >
                <div className="rfm-insight-card-header">
                  <span className="rfm-insight-card-label-champions">Champions (Khách VIP)</span>
                  <span className="rfm-insight-card-count">{rfmMetrics.championsCount}</span>
                </div>
                <div className="rfm-insight-card-content">
                  <span className="rfm-insight-card-desc">Chi tiêu nhiều, ghé tiệm thường xuyên.</span>
                  <span className="rfm-insight-card-proposal">Đề xuất: Tặng voucher VIP độc quyền.</span>
                </div>
                <div className="rfm-insight-card-action-champions">
                  <span>Xem danh sách</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* At Risk (Nguy cơ rời bỏ) */}
              <div 
                className="rfm-insight-card at-risk-card cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleSegmentClick("At Risk")}
              >
                <div className="rfm-insight-card-header">
                  <span className="rfm-insight-card-label-at-risk">At Risk (Nguy cơ rời bỏ)</span>
                  <span className="rfm-insight-card-count">{rfmMetrics.atRiskCount}</span>
                </div>
                <div className="rfm-insight-card-content">
                  <span className="rfm-insight-card-desc">Đã từng gắn bó nhưng lâu chưa ghé.</span>
                  <span className="rfm-insight-card-proposal">Đề xuất: Gửi mã giảm giá kéo khách.</span>
                </div>
                <div className="rfm-insight-card-action-at-risk">
                  <span>Xem danh sách</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* New Customers (Khách mới) */}
              <div 
                className="rfm-insight-card new-customers-card cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleSegmentClick("New Customers")}
              >
                <div className="rfm-insight-card-header">
                  <span className="rfm-insight-card-label-new-customers">New Customers (Khách mới)</span>
                  <span className="rfm-insight-card-count">{rfmMetrics.newCount}</span>
                </div>
                <div className="rfm-insight-card-content">
                  <span className="rfm-insight-card-desc">Đăng ký thành viên & ghé tiệm lần đầu.</span>
                  <span className="rfm-insight-card-proposal">Đề xuất: Khuyến mãi lượt rửa thứ 2.</span>
                </div>
                <div className="rfm-insight-card-action-new-customers">
                  <span>Xem danh sách</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          </div>

          {/* RFM Customer List */}
          <div className="transition-all">
            <RfmTable data={rfm} initialSegment={selectedRfmSegment} />
          </div>
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="transition-all report-large-visualization-container">
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

function SummaryCard({ title, value, subtitle, cardClass }) {
  if (cardClass === "row1") {
    let emoji = "📊";
    if (title.toLowerCase().includes("thu")) emoji = "💰";
    else if (title.toLowerCase().includes("book")) emoji = "📅";
    else if (title.toLowerCase().includes("hàng")) emoji = "👥";
    else if (title.toLowerCase().includes("thành")) emoji = "✅";

    return (
      <div className="report-stat-card-row1">
        <div className="report-stat-card-header">
          <span className="report-stat-card-label">{title}</span>
          <div className="report-stat-card-icon-overlay">
            <span className="report-stat-card-icon">{emoji}</span>
          </div>
        </div>
        <div className="report-stat-card-value-container">
          <h3 className="report-stat-card-value">{value}</h3>
        </div>
        {subtitle && (
          <div className="report-stat-card-subtitle-container">
            <span className="report-stat-card-subtitle">{subtitle}</span>
          </div>
        )}
      </div>
    );
  } else if (cardClass === "row2") {
    return (
      <div className="report-stat-card-row2">
        <span className="report-stat-card-row2-label">{title}</span>
        <div className="report-stat-card-row2-value-container">
          <h3 className="report-stat-card-row2-value">{value}</h3>
        </div>
        {subtitle && (
          <span className="report-stat-card-row2-subtitle">{subtitle}</span>
        )}
      </div>
    );
  }

  // Fallback default card
  return (
    <div className="report-stat-card">
      <span className="report-stat-label">{title}</span>
      <h3 className="report-stat-value">
        {value}
      </h3>
      {subtitle && <span className="text-[10px] text-slate-400 mt-1 leading-none font-medium">{subtitle}</span>}
    </div>
  );
}
