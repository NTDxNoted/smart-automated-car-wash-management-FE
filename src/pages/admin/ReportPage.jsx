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
import "./ReportPage.css";

export default function ReportPage() {
  const [overview, setOverview] = useState(null);
  const [rfm, setRfm] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        const [overviewData, rfmData, tierData, loyaltyData] = await Promise.all([
          getOverviewReport({ signal: controller.signal }),
          getRfmReport({ signal: controller.signal }),
          getTierDistribution({ signal: controller.signal }),
          getLoyaltyStats({ signal: controller.signal }),
        ]);

        if (!isMounted) return;

        setOverview(overviewData);
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

  const rfmMetrics = useMemo(() => {
    let championsCount = 0;
    let atRiskCount = 0;
    let newCount = 0;

    (rfm || []).forEach(row => {
      const r = Number(row.recency);
      const f = Number(row.frequency);
      const m = Number(row.monetary);

      if (r <= 5 && f >= 15 && m >= 3000000) {
        championsCount++;
      } else if (r > 15 && f >= 8) {
        atRiskCount++;
      } else if (r <= 7 && f <= 2) {
        newCount++;
      }
    });

    return { championsCount, atRiskCount, newCount };
  }, [rfm]);

  const [activeTab, setActiveTab] = useState("overview");

  if (!overview || !loyalty) {
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
      <div>
        <h2 className="report-page-title">Báo cáo & Phân tích</h2>
        <p className="report-page-subtitle">
          Theo dõi tổng quan vận hành, số liệu Loyalty và bảng dữ liệu khách hàng RFM
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="report-tabs-bar">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
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
              value={`${overview.summary.revenue.toLocaleString()} VNĐ`}
            />
            <SummaryCard
              title="Tổng số Bookings"
              value={overview.summary.bookings?.toLocaleString()}
            />
            <SummaryCard
              title="Tổng số Customers"
              value={overview.summary.customers?.toLocaleString()}
            />
          </div>

          <div className="report-charts-grid">
            <OverviewChart data={overview.revenue} />
            <BookingStatusPieChart data={overview.bookingStatus} />
          </div>

          {/* Loyalty & RFM Insights Panel */}
          <div className="report-chart-card bg-slate-50 border-slate-200 mt-6" style={{ gridColumn: "span 2" }}>
            <h3 className="report-chart-title flex items-center gap-2 text-[#00677F] mb-4">
              <span>💡 Chỉ số chẩn đoán & Đề xuất tiếp thị (RFM Insights)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between" style={{ minHeight: "140px" }}>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Champions (Khách xuất sắc)</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{rfmMetrics.championsCount}</p>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Khách hàng chi tiêu nhiều, ghé tiệm thường xuyên. Đề xuất: Tặng ưu đãi độc quyền để giữ chân VIP.</p>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between" style={{ minHeight: "140px" }}>
                <div>
                  <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">At Risk (Nguy cơ rời bỏ)</span>
                  <p className={`text-2xl font-bold mt-1 ${rfmMetrics.atRiskCount > 0 ? "text-red-600" : "text-slate-800"}`}>
                    {rfmMetrics.atRiskCount}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Đã từng gắn bó nhưng lâu chưa ghé tiệm. Đề xuất: Khởi chạy chiến dịch khuyến mãi nhắm đối tượng để lôi kéo.</p>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between" style={{ minHeight: "140px" }}>
                <div>
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">New Registrations (Khách mới)</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{rfmMetrics.newCount}</p>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Vừa đăng ký tài khoản thành viên. Đề xuất: Gửi hướng dẫn tích điểm Loyalty và ưu đãi rửa xe lần đầu.</p>
              </div>
            </div>
          </div>
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
