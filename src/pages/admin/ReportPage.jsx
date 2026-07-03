import { useEffect, useState } from "react";

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
